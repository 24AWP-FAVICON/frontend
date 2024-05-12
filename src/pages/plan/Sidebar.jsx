import {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SelectPlace from './SelectPlace';
import SelectTime from './SelectTime';
import Slidebar from './Slidebar'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
  // 사이드바를 열고 닫는 함수
  const toggleSlidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div className="sidebar">
        <div className="loc">제주</div>
        
        <div className="search">
          <input id="name" type="text" placeholder="장소나 숙소를 검색하세요." />
        </div>

        <div className="button">
          <div><Link to="/time" id="selectTime">시간 선택</Link></div>
          <div><Link to="/place" id="selectPlace">장소 선택</Link></div>
        </div>
        <Routes>
          <Route path="/time" element={<SelectTime />} />
          <Route path="/place" element={<SelectPlace />} />
        </Routes>
        <div className={`slidebar ${isOpen ? 'open':''}`}>
          <Slidebar />
        </div>
        <div className="toggle-button" onClick={toggleSlidebar}>
          {isOpen ? '<' : '>'}
        </div>
      </div>
    </Router>
  );
}

export default Sidebar;