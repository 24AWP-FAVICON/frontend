import React from 'react';

function Slidebar({ selectedDates }) {
  // 선택된 날짜를 사용하여 렌더링
  return (
    <div className="slidebar_">
      <div>
        <p><b>Planner</b></p>
      </div>
      <div>
        {selectedDates.map((date, index) => (
          <div className='container_' key={index}><h3>{date.date}</h3></div>
        ))}
      </div>
    </div>
  );
}

export default Slidebar;
