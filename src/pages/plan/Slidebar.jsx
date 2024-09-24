import React from 'react';

function Slidebar({ selectedDates, onDrop, locationName, budget }) {
  const handleDeleteItem = (index, itemIndex) => {
    const updatedDates = selectedDates.map((date, i) => {
      if (i === index) {
        return {
          ...date,
          items: date.items.filter((_, j) => j !== itemIndex),
        };
      }
      return date;
    });

    // 상태를 업데이트하기 위해 부모 컴포넌트로 콜백 함수를 전달합니다.
    onDrop(updatedDates);
  };
  
  const handleDrop = (index, event) => {
    event.preventDefault();  // 기본 동작 방지
  
    // 드래그된 데이터를 가져와 처리
    const droppedData = JSON.parse(event.dataTransfer.getData("application/json"));
    
    if (selectedDates[index].items) {
      selectedDates[index].items.push({
        name: droppedData.name,
        address: droppedData.address,
      });
    } else {
      selectedDates[index].items = [{
        name: droppedData.name,
        address: droppedData.address,
      }];
    }
  
    onDrop(selectedDates); // 수정된 데이터를 부모 컴포넌트에 전달
  };  

  return (
    <div className="p-6 font-sans bg-gray-200  w-full shadow-md border border-gray-200">
      <div className="text-2xl font-bold mb-6 text-gray-800">
        <p>Planner</p>
      </div>
      <div className="space-y-6 h-full overflow-y-auto mt-6 mb-6 rounded-lg" style={{ maxHeight: '78vh' }}>
        {selectedDates.map((date, index) => (
          <div
              className="p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
              key={index}
              onDrop={(e) => handleDrop(index, e)}  // event 객체를 함께 전달
              onDragOver={(e) => e.preventDefault()}  // 드래그 중 기본 동작 방지
            >          
            <div className="flex flex-col mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{date.date}</h3>
              <h3 className="text-lg font-semibold text-gray-700">{date.cost}원</h3>
            </div>
            {date.items && date.items.map((item, itemIndex) => (
              <div className="flex justify-between items-center mt-4 cursor-pointer" key={itemIndex}>
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                  {itemIndex + 1}
                </div>
                <div className="relative border-2 border-gray-200 rounded-lg p-2 w-56 h-24 text-sm font-semibold bg-white shadow-sm">
                  <div className="text-gray-800 w-4/4 flex justify-between">
                    {item.name}
                    <button
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition-colors duration-200 ease-in-out shadow focus:outline-none focus:ring-2 focus:ring-red-300"
                      onClick={() => handleDeleteItem(index, itemIndex)}
                    >
                      삭제
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.address}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-1 bg-gray-50 rounded-b-lg">
                    <input className="w-28 p-1 border border-gray-300 rounded-md text-xs" type="time" />
                    <span className="mx-1">-</span>
                    <input className="w-28 p-1 border border-gray-300 rounded-md text-xs" type="time" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slidebar;