import { useState } from 'react';
import './SelectTime.css';

function SelectTime(){
  const date = new Date();
  let day = date.getFullYear() + "-"+
  (date.getMonth()<10 ? ('0'+date.getMonth()):date.getMonth()) + "-" +
  (date.getDate()<10 ? ('0'+date.getDate()):date.getDate());
  const [startDate, setStartDate] = useState(day.toString());
  const [duration, setDuration] = useState('3');
  const [resultDates, setResultDates] = useState([]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const calculateDates = () => {
    if (startDate && duration) {
      const parsedStartDate = new Date(startDate);
      const parsedDuration = parseInt(duration);

      const dates = [];
      for (let i = 0; i < parsedDuration; i++) {
        const resultDate = new Date(parsedStartDate);
        resultDate.setDate(parsedStartDate.getDate() + i);
        const day = getDayOfWeek(resultDate.getDay());
        dates.push({date: resultDate.toISOString().split('T')[0], day: day});
      }

      setResultDates(dates);
    } else {
      setResultDates(['날짜와 기간을 모두 입력해주세요.']);
    }
  };
  const getDayOfWeek = (dayIndex) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
  };

  return(
    <div className="selectTimeElement">
      <div>
        <label>
          시작 날짜:
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </label>
        <p></p>
        <label>
          기간 (일):&nbsp;
          <input type="number" value={duration} onChange={handleDurationChange} />
        </label>
        <p></p>
        <p></p>
        <button onClick={calculateDates}>확인</button>
      </div>
        
      <div>
        <table>
          <tr>
            <td>일자</td>
            <td>요일</td>
          </tr>
          {resultDates.map((date,index) => (
            <tr><td>{date.date}</td><td>{date.day}</td></tr>
          ))}
        </table>
      </div>
      
      <div>
        <button>기간 설정 완료</button>
      </div>
    </div>
  );
}

export default SelectTime