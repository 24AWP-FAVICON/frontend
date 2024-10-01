import { useState, useEffect } from 'react';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { tripPost, tripIdPost, tripIdShare } from '../plan/PlanApiService'; // API 서비스 가져오기
import { createChatRoom } from '../sns/ChatApiService'; // Chat API 가져오기
import Cookies from 'js-cookie';

function Sidebar({ placesData, locationName }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isTime, setIsTime] = useState(true);
  const [isPlace, setIsPlace] = useState(false);
  const [tripName, setTripName] = useState(''); // 여행 이름 추가
  const [participantIds, setParticipantIds] = useState([]); // 참여자 이메일 리스트
  const [userEmail, setUserEmail] = useState(''); // 사용자의 이메일 상태
  const [selectedDates, setSelectedDates] = useState([]);
  const [loc, setLoc] = useState('');
  const [draggedElement, setDraggedElement] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);
  const [resultDates, setResultDates] = useState([]);
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 저장
  const [tripId, setTripId] = useState(null); // 여행 계획 ID 상태 추가

  // 사용자 이메일을 가져오는 함수
  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = Cookies.get("access");

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/user/info`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.userId);  // 사용자 이메일 설정
          setParticipantIds([data.userId]);  // 자기 자신을 참여자 리스트에 추가
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Failed to fetch user info', error);
      }
    };

    fetchUserInfo();  // 컴포넌트가 로드될 때 사용자 정보 가져오기
  }, []);

  const handleCreateTrip = async () => {
    try {
      // 종료 날짜 계산
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(duration));
  
      // 첫 번째 API 호출 - 여행 계획 생성
      const tripData = {
        tripName,  // 여행 이름
        tripArea: locationName,  // 선택된 지역
        startDate: startDate.toISOString().split('T')[0],  // 시작 날짜
        endDate: endDate.toISOString().split('T')[0],  // 종료 날짜
        budget,
        participantIds  // 참여자 ID
      };
      const response = await tripPost(tripData);  // 여행 계획 생성 API 호출
      const newTripId = response.data.tripId;  // tripId 받아오기
      setTripId(newTripId);
      console.log(newTripId, "tripId");
      // 두 번째 API 호출 - 세부 일정 저장
      // 여러 개의 세부 일정을 배열로 준비
      const detailDataArray = resultDates.map((date, index) => ({
        tripDate: date.date,
        tripDay: index + 1,
        budget: date.cost || 0, // 각 날짜별 예산
        locations: date.items ? date.items.map((item) => ({
          locationName: item.name,
          locationAddress: item.address,
        })) : [],
        accommodation: date.accommodation ? {
          accommodationName: date.accommodation.name,
          accommodationAddress: date.accommodation.address,
        } : null  // 숙소가 있으면 객체로 저장, 없으면 null
      }));

      console.log("Detail Data to send: ", detailDataArray);

      // 두 번째 API 호출 - 리스트로 세부 일정 전송
      await tripIdPost(newTripId, detailDataArray);  // 세부 일정 배열 전송 API 호출

      alert('여행 계획이 성공적으로 생성되었습니다!');
      setShowModal(true);
    } catch (error) {
      console.error('여행 계획 생성 중 오류 발생:', error);
      alert('여행 계획 생성에 실패했습니다.');
    }
  };
  

  const handleDates = (childData) => {
    setSelectedDates(childData);
  };

  
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setBudget(parseInt(event.target.value || '0'));
  };

  const handleItemsChange = (newItems) => {
    setItems(newItems);
  };

  const handleResultDatesChange = (newDates) => {
    setResultDates(newDates);
  };

  const toggleSlidebar = () => {
    setIsOpen(!isOpen);
  };

  const selectTime = () => {
    setIsTime(true);
    setIsPlace(false);
  };

  const selectPlace = () => {
    setIsTime(false);
    setIsPlace(true);
  };

  const selectLoc = (event) => {
    setLoc(event.target.value);
    setIsTime(false);
    setIsPlace(true);
  };

  const handleDragStart = (element) => {
    setDraggedElement(element);
  };
  
  const handleDropToSlidebar = (index) => {
    if (Array.isArray(index)) {
      setSelectedDates(index);
    } else if (draggedElement) {
      setSelectedDates((prevDates) =>
        prevDates.map((date, i) =>
          i === index ? { ...date, items: [...(date.items || []), draggedElement] } : date
        )
      );
      setDraggedElement(null);
    }
  };

  const closeModal = () => {
    setShowModal(false); // 모달 창 닫기
  };

  return (
    <div className={`flex ${isOpen ? "w-full" : "w-2/6"}`} style={{ height: '96vh' }}>
      <div className={`flex flex-col ${isOpen ? "w-2/4" : "w-full"} h-full border-r-2 border-gray-300 bg-gray-50 shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-gray-300">
          <span className="font-bold text-lg text-gray-700">{locationName}</span>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition" onClick={toggleSlidebar}>
            <span className="text-xl text-gray-700">{!isOpen ? <FiChevronRight /> : <FiChevronLeft />}</span>
          </button>
        </div>
        <div className="p-4 bg-gray-100">
          {/* 여행 이름 입력 필드 추가 */}
          <input
            id="tripName"
            type="text"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="여행 계획 이름을 입력하세요."
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
          <input
            id="name"
            type="text"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="장소나 숙소를 검색하세요."
            onChange={(e) => selectLoc(e)}
          />
        </div>
        <div className="flex p-4 bg-white shadow">
          <button
            onClick={selectTime}
            className={`flex-1 p-2 text-center rounded-lg transition ${
              isTime ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            시간선택
          </button>
          <button
            onClick={selectPlace}
            className={`flex-1 p-2 ml-2 text-center rounded-lg transition ${
              isPlace ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            장소선택
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
          {isTime ? (
            <SelectTime
              onData={handleDates}
              startDate={startDate}
              duration={duration}
              budget={budget}
              items={items}
              resultDates={resultDates}
              onStartDateChange={handleStartDateChange}
              onDurationChange={handleDurationChange}
              onBudgetChange={handleBudgetChange}
              onItemsChange={handleItemsChange}
              onResultDatesChange={handleResultDatesChange}
              locationName={locationName}
            />
          ) : (
            <SelectPlace
              pick={loc}
              onDragStart={handleDragStart}
              placesData={placesData}
              locationName={locationName} // locationName을 SelectPlace로 전달
            />
            
          )}
        </div>
      </div>

      <div className={`transition-all duration-300 ${isOpen ? "flex-grow" : "w-0"} overflow-hidden`}>
        <Slidebar
          selectedDates={selectedDates}
          locationName={locationName}
          budget={budget}
          onDrop={handleDropToSlidebar}
          onDragOver={(e) => e.preventDefault()}
          style={{ height: '100%' }}
        />
        {selectedDates.length > 0 && (
          <div className="p-4 bg-white">
            <button onClick={handleCreateTrip} className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              생성하기
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center" style={{ zIndex: 1000 }}>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">여행 일정 초대</h2>
            {/* 안내 메시지 추가 */}
            <p>이메일을 콤마(,)로 구분하여 나열하여 적어주세요:</p>
            <input
              type="text"
              className="w-full p-2 mt-2 border border-gray-300 rounded"
              placeholder="예: email1@gmail.com, email2@gmail.com"
              onChange={(e) => {
                // 입력된 값을 쉼표로 구분하여 리스트로 변환
                const emails = e.target.value.split(',').map(email => email.trim());
                  setParticipantIds([userEmail, ...emails]);  // 자기 자신과 입력된 이메일들 추가
                }}
            />
            <div className="mt-4">
              <button onClick={async () => {
                try {
                  await tripIdShare(tripId, { userGoogleIds: participantIds }); // API 호출
                  await createChatRoom(tripName, participantIds);
                  alert('참여자가 성공적으로 초대되었습니다!');
                  closeModal(); // 모달 닫기
                } catch (error) {
                  console.error('참여자 초대 중 오류 발생:', error);
                  alert('참여자 초대에 실패했습니다.');
                }
              }} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                완료
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Sidebar;
