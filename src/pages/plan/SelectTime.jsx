// SelectTime.js
import { useState } from 'react';
import './SelectTime.css';

function SelectTime({ onData }) {
  const date = new Date();
  let day = date.getFullYear() + "-" +
    (date.getMonth() < 10 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "-" +
    (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
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
    const budget = parseInt(event.target.value || '0');
    setIsBudget(budget);
    setIsBalance(budget - items.reduce((acc, item) => acc + item.cost, 0));
  };

  const sendDataToParent = () => {
    onData(resultDates);
  };

  const changeBalance = (e, index) => {
    const newItems = [...items];
    newItems[index].cost = parseInt(e.target.value || '0');
    setItems(newItems);
    const totalCost = newItems.reduce((acc, item) => acc + item.cost, 0);
    setIsBalance(isBudget - totalCost);
  };

  const calculateDates = () => {
    if (startDate && duration) {
      const parsedStartDate = new Date(startDate);
      const parsedDuration = parseInt(duration);
      let dates = [];
      let items = [];
      for (let i = 0; i < parsedDuration; i++) {
        const resultDate = new Date(parsedStartDate);
        resultDate.setDate(parsedStartDate.getDate() + i);
        const day = getDayOfWeek(resultDate.getDay());
        dates.push({ index: i, date: resultDate.toISOString().split('T')[0], day: day, cost: 0 });
        items.push({ name: `Day ${i + 1}`, cost: 0 });
      }
      setItems(items);
      setResultDates(dates);
    }
  };

  const getDayOfWeek = (dayIndex) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
  };

  return (
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
          <thead>
            <tr>
              <th>일자</th>
              <th>요일</th>
              <th>예산</th>
            </tr>
          </thead>
          <tbody>
            {resultDates.map((date, index) => (
              <tr key={index}>
                <td>{date.date}</td>
                <td>{date.day}</td>
                <td><input type="number" onChange={(e) => changeBalance(e, index)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={sendDataToParent}>기간 설정 완료</button>
      </div>
    </div>
  );
}

export default SelectTime;
