// Sidebar.js
import { useState } from 'react';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
  const [isTime, setIsTime] = useState(true); // 시간선택 상태
  const [isPlace, setIsPlace] = useState(false); // 장소선택 상태
  const [selectedDates, setSelectedDates] = useState([0]);
  const [loc, setLoc] = useState('');

  const handleDates = (childData) => {
    setSelectedDates(childData);
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
    setLoc(event.target.value)
    setIsTime(false);
    setIsPlace(true);
  }
  return (
    <div className="sidebar">
      <div className="loc">제주</div>
      <div className="search">
        <input
          id="name"
          type="text"
          placeholder="장소나 숙소를 검색하세요."
          onChange={(e) => selectLoc(e)}
        />
      </div>
      <div className="button">
        <button onClick={selectTime} className={`${isTime ? "click" : ""}`}>
          시간선택
        </button>
        <button onClick={selectPlace} className={`${isPlace ? "click" : ""}`}>
          장소선택
        </button>
      </div>
      <div className="block">
        {isTime ? <SelectTime onData={handleDates} /> : <SelectPlace pick={loc} />}
      </div>
      <div className={`slidebar ${isOpen ? "open" : ""}`}>
        <Slidebar selectedDates={selectedDates} />
      </div>
      <div className="toggle-button" onClick={toggleSlidebar}>
        <b>{isOpen ? "<" : ">"}</b>
      </div>
    </div>
  );
}

export default Sidebar;