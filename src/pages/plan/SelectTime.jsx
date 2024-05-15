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
  const [isBudget, setIsBudget] = useState('0');
  const [items, setItems] = useState([{ name: '', cost: 0 }]);
  const [isBalance, setIsBalance] = useState('0');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setIsBudget(event.target.value);
    setIsBalance(parseInt(event.target.value ? event.target.value:'0')-0);
  };
  
  const changeBalance = (e, v) => {
    let minus = 0;
    for(let i=0; i<items.length;i++){
      if(i===v && e.target.value){
        items[i].cost = e.target.value;
      }
      minus += parseInt(items[i].cost);
      console.log(minus);
    }
    setIsBalance(isBudget - minus);
  }

  const dates = [];
  const calculateDates = () => {
    if (startDate && duration) {
      const parsedStartDate = new Date(startDate);
      const parsedDuration = parseInt(duration);
      let li = [];
      for (let i = 0; i < parsedDuration; i++) {
        const resultDate = new Date(parsedStartDate);
        resultDate.setDate(parsedStartDate.getDate() + i);
        const day = getDayOfWeek(resultDate.getDay());
        dates.push({index:i, date: resultDate.toISOString().split('T')[0], day: day, cost: 0});
        li.push({name:{i},cost:0});
      }
      setItems(li);
      console.log(li);
      setResultDates(dates);
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
        <label>
          총예산액:&nbsp;
          <input type="number" value={isBudget} onChange={handleBudgetChange} />
        </label>
        <p></p>
        <p></p>
        <button onClick={calculateDates}>확인</button>
      </div>
        
      <div>
        <h3>잔액 : {isBalance}</h3>
        <table>
          <tr>
            <td>일자</td>
            <td>요일</td>
            <td>예산</td>
          </tr>
          {resultDates.map((date,index) => (
            <tr><td>{date.date}</td><td>{date.day}</td><td><input type="number" onChange={(e) => changeBalance(e, index)} /></td></tr>
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