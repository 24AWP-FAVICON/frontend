import { useState, useEffect } from 'react';
import placeData from "./place.json";

function SelectPlace({ placesData, pick, onDragStart, locationName }) {
  const [filteredData, setFilteredData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('tourist'); // 'tourist' 또는 'lodging'

  useEffect(() => {
    if (locationName && placeData[locationName]) {
      const touristResults = placeData[locationName].filter(item =>
        item.name.toLowerCase().includes(pick.toLowerCase())
      );

      if (activeCategory === 'tourist') {
        setFilteredData(touristResults);
      } else if (activeCategory === 'lodging') {
        setFilteredData(placesData);
      }
    }
  }, [pick, placesData, activeCategory, locationName]);

  return (
    <div className="w-full p-4 space-y-4 overflow-y-auto" style={{ minHeight: '500px', maxHeight: '100%' }}>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveCategory('tourist')}
          className={`flex-1 p-2 text-center rounded-lg transition ${
            activeCategory === 'tourist' ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          관광지
        </button>
        <button
          onClick={() => setActiveCategory('lodging')}
          className={`flex-1 p-2 text-center rounded-lg transition ${
            activeCategory === 'lodging' ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          숙소
        </button>
      </div>
      {filteredData.map((location) => (
        <div
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 transition w-full"
          draggable="true"
          key={location.id}
          onDragStart={() => onDragStart(location)}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="text-lg font-semibold">{location.name}</div>
            <div className="text-sm text-gray-500 overflow-hidden text-ellipsis">
              {location.address}
            </div>
            <div className="hidden time mt-2 items-center space-x-2">
              <input
                className="w-20 p-2 border border-gray-300 rounded"
                type="time"
                placeholder="00:00"
              />
              <span>-</span>
              <input
                className="w-20 p-2 border border-gray-300 rounded"
                type="time"
                placeholder="00:00"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SelectPlace;
