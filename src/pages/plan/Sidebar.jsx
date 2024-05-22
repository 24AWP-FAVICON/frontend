import { useState } from 'react';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
  const [isTime, setIsTime] = useState(true); // 시간선택 상태
  const [isPlace, setIsPlace] = useState(false); // 장소선택 상태
  const [selectedDates, setSelectedDates] = useState([]);
  const [loc, setLoc] = useState('');
  const [draggedElement, setDraggedElement] = useState(null); // 드래그된 요소 상태
  const [startDate, setStartDate] = useState(new Date()); // 시작 날짜 상태
  const [duration, setDuration] = useState(''); // 기간 상태
  const [budget, setBudget] = useState(0); // 예산 상태
  const [items, setItems] = useState([]); // 항목 상태
  const [resultDates, setResultDates] = useState([]); // 결과 날짜 상태

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

  // 사이드바를 열고 닫는 함수
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
    if (draggedElement) {
      setSelectedDates((prevDates) =>
        prevDates.map((date, i) =>
          i === index ? { ...date, items: [...(date.items || []), draggedElement] } : date
        )
      );
      setDraggedElement(null); // 드래그된 요소 상태 초기화
    }
  };

  return (
    <div className={`flex ${isOpen ? "w-full" : "w-2/6"}`} style={{ height: '100%' }}>
      <div className={`flex flex-col ${isOpen ? "w-2/4" : "w-full"} h-full border-r-2 border-gray-300 bg-gray-50 shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-gray-300">
          <span className="font-bold text-lg text-gray-700">제주</span>
          <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition" onClick={toggleSlidebar}>
            <span className="text-xl text-gray-700">{!isOpen ? <FiChevronRight /> : <FiChevronLeft />}</span>
          </button>
        </div>
        <div className="p-4 bg-gray-100">
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
            />
          ) : (
            <SelectPlace
              pick={loc}
              onDragStart={handleDragStart}
            />
          )}
        </div>
      </div>
      
      <div className={`transition-all duration-300 ${isOpen ? "flex-grow" : "w-0"} overflow-hidden`}>
        <Slidebar
          selectedDates={selectedDates}
          onDrop={handleDropToSlidebar}
          onDragOver={(e) => e.preventDefault()}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

export default Sidebar;
