import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function SelectTime({
  onData,
  startDate,
  duration,
  budget,
  items,
  resultDates,
  onStartDateChange,
  onDurationChange,
  onBudgetChange,
  onItemsChange,
  onResultDatesChange,
}) {
  const [balance, setBalance] = useState(0);
  const [animationKey, setAnimationKey] = useState(0); // 애니메이션 효과를 위한 키 상태

  useEffect(() => {
    const totalCost = items.reduce((acc, item) => acc + item.cost, 0);
    setBalance(budget - totalCost);
  }, [budget, items]);

  const handleCostChange = (index, cost) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, cost: parseInt(cost) || 0 } : item
    );
    onItemsChange(newItems);
    updateResultDatesWithCost(newItems);
  };

  const calculateDates = () => {
    if (startDate && duration) {
      const newDates = [];
      const newItems = [];
      for (let i = 0; i < duration; i++) {
        const resultDate = new Date(startDate);
        resultDate.setDate(resultDate.getDate() + i);
        const day = getDayOfWeek(resultDate.getDay());
        newItems.push({ name: `Day ${i + 1}`, cost: 0 });
        newDates.push({
          index: i,
          date: resultDate.toLocaleDateString('en-CA'), // YYYY-MM-DD 형식으로 로컬 날짜 변환
          day: day,
          cost: 0
        });
      }
      onItemsChange(newItems);
      onResultDatesChange(newDates);
      setAnimationKey(prevKey => prevKey + 1); // 애니메이션 효과를 위한 키 업데이트
    }
  };

  const updateResultDatesWithCost = (items) => {
    const updatedDates = resultDates.map((date, index) => ({
      ...date,
      cost: items[index].cost
    }));
    onResultDatesChange(updatedDates);
  };

  const getDayOfWeek = (dayIndex) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
  };

  const sendDataToParent = () => {
    onData(resultDates);
  };

  return (
    <div className="w-full p-5 font-sans bg-white h-full" style={{ minHeight: '500px', maxHeight: '500px' }}>
      <div>
        <label className="block mb-2 font-semibold w-full">
          시작 날짜<hr />
          <DatePicker
            selected={startDate} 
            onChange={onStartDateChange} 
            dateFormat="yyyy-MM-dd"
            className="w-full p-2 mt-1 mb-3 border border-gray-300 rounded bg-gray-200"
          />
        </label>
        <p className="h-2"></p>
        <label className="block mb-2 font-semibold w-full">
          기간 (일) <hr />
          <input 
            type="number" 
            value={duration} 
            onChange={onDurationChange} 
            placeholder='0'
            className="w-full p-2 mt-1 mb-3 border border-gray-300 rounded bg-gray-200"
          />
        </label>
        <p className="h-2"></p>
        <label className="block mb-2 font-semibold">
          총예산액 <hr />
          <input 
            type="number"
            onChange={onBudgetChange} 
            placeholder='0'
            className="w-full p-2 mt-1 mb-3 border border-gray-300 rounded bg-gray-200"
          />
        </label>
        <p className="h-2"></p>
        <button 
          onClick={calculateDates} 
          className="w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-500 rounded hover:bg-blue-600 active:bg-blue-700"
        >
          확인
        </button>
      </div>

      <div key={animationKey} className="fade-in mt-5"> {/* key 속성을 추가하여 애니메이션 효과 적용 */}
        {resultDates.length === 0 ? (
          <h3 className="text-lg font-semibold text-center">여기에 일정이 표시됩니다.</h3>
        ) : (
          <>
            <h3 className="mt-5 text-lg font-semibold">잔액 : {balance}</h3>
            <table className="w-full mt-3 border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border text-nowrap">일자</th>
                  <th className="p-2 border text-nowrap">요일</th>
                  <th className="p-2 border text-nowrap">예산</th>
                </tr>
              </thead>
              <tbody>
                {resultDates.map((date, index) => (
                  <tr key={index}>
                    <td className="p-2 border text-nowrap">{date.date}</td>
                    <td className="p-2 border">{date.day}</td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        placeholder='0'
                        onChange={(e) => handleCostChange(index, e.target.value)}
                        className="w-full p-1 text-center border border-gray-300 rounded bg-gray-200"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div className="mt-5">
        <button 
          onClick={sendDataToParent} 
          className="w-full px-4 py-2 text-white transition-colors duration-300 bg-blue-500 rounded hover:bg-blue-600 active:bg-blue-700"
        >
          기간 설정 완료
        </button>
      </div>
    </div>
  );
}

export default SelectTime;
