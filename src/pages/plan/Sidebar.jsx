import { useState } from 'react';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { tripPost, tripIdPost } from '../plan/PlanApiService'; // API 서비스 가져오기

function Sidebar({ placesData, locationName }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isTime, setIsTime] = useState(true);
  const [isPlace, setIsPlace] = useState(false);
  const [tripName, setTripName] = useState(''); // 여행 이름 추가
  const [participantIds, setParticipantIds] = useState(['minbory925@gmail.com']); // 고정된 참여자
  const [selectedDates, setSelectedDates] = useState([]);
  const [loc, setLoc] = useState('');
  const [draggedElement, setDraggedElement] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState(0);
  const [items, setItems] = useState([]);
  const [resultDates, setResultDates] = useState([]);

  const handleCreateTrip = async () => {
    try {
      // 종료 날짜 계산
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(duration));

      // 첫 번째 API 호출 - 여행 계획 생성
      const tripData = {
        tripName,  // 여행 이름
        tripArea: loc,  // 선택된 지역
        startDate: startDate.toISOString().split('T')[0],  // 시작 날짜
        endDate: endDate.toISOString().split('T')[0],  // 종료 날짜
        budget,
        participantIds  // 참여자 ID
      };
      const response = await tripPost(tripData);  // 여행 계획 생성 API 호출
      const tripId = response.data.tripId;  // tripId 받아오기
      console.log(tripId, "tripId");
      // 두 번째 API 호출 - 세부 일정 저장
      for (const [index, date] of resultDates.entries()) {
        const detailData = {
          tripDate: date.date,
          tripDay: index + 1,
          budget: date.cost,  // 각 날짜별 예산
          // accommodation: {
          //   accommodationName: date.accommodation?.name || "숙소 이름",
          //   accommodationLocation: date.accommodation?.location || "숙소 주소"
          // },
          locations: date.items.map(item => ({
            locationName: item.name,
            locationAddress: item.address
          }))
        };
        await tripIdPost(tripId, detailData);  // 세부 일정 API 호출
      }
  
      alert('여행 계획이 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('여행 계획 생성 중 오류 발생:', error);
      alert('여행 계획 생성에 실패했습니다.');
    }
  };

  const handleDates = (childData) => {
    setSelectedDates(childData);
    console.log(childData);
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
      </div>
    </div>
  );
}

export default Sidebar;
