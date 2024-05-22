import React from 'react';

function Slidebar({ selectedDates, onDrop }) {
  const sendData = () => {
    console.log(selectedDates);
  };

  return (
    <div className="p-6 font-sans bg-gray-200 h-full w-full shadow-md border border-gray-200">
      <div className="text-2xl font-bold mb-6 text-gray-800">
        <p>Planner</p>
      </div>
      <div className="space-y-6 h-full overflow-y-auto mt-6 rounded-lg" style={{ maxHeight: '500px' }}>
        {selectedDates.map((date, index) => (
          <div
            className="p-4 bg-gray-50 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
            key={index}
            onDrop={() => onDrop(index)}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-col mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{date.date}</h3>
              <h3 className="text-lg font-semibold text-gray-700">{date.cost}</h3>
            </div>
            {date.items && date.items.map((item, itemIndex) => (
              <div className="flex justify-between items-center mt-4 cursor-pointer" key={itemIndex}>
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                  {itemIndex + 1}
                </div>
                <div className="relative border-2 border-gray-200 rounded-lg p-2 w-56 h-20 text-sm font-semibold bg-white shadow-sm">
                <div className="text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.address}
                </div>
                <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-1 bg-gray-50 rounded-b-lg">
                  <input className="w-20 p-1 border border-gray-300 rounded-md text-xs" type="time" placeholder="00:00" />
                  <span className="mx-1">-</span>
                  <input className="w-20 p-1 border border-gray-300 rounded-md text-xs" type="time" placeholder="00:00" />
                </div>
              </div>

              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center h-16">
        <button className="w-1/2 h-full bg-blue-500 text-white rounded-lg flex items-center justify-center shadow hover:bg-blue-600 transition" onClick={sendData}>
          공유하기
        </button>
      </div>
    </div>
  );
}

export default Slidebar;
