// Slidebar.js
import React from 'react';

function Slidebar({ selectedDates }) {
  const handle = () => {
    if (navigator.share) {
        navigator.share({
            title: 'favicon',
            url: './plan',
        });
    }else{
        alert("공유하기가 지원되지 않는 환경 입니다.")
    }
  }
  
  // 선택된 날짜를 사용하여 렌더링
  return (
    <div className="slidebar_">
      <div>
        <p><b>Planner</b></p>
      </div>
      <div>
        {selectedDates.map((date, index) => (
          <div className='container_' key={index}>
            <h3>{date.date}</h3>
            <h3>{date.cost}</h3>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => {handle()}}>
          공유하기
        </button>
      </div>
    </div>
  );
}

export default Slidebar;
