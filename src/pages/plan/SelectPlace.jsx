import { useState, useEffect } from 'react';
import placeData from "./place.json";

function SelectPlace({ pick, onDragStart }) {
  const [filteredData, setFilteredData] = useState(placeData['파리']);

  useEffect(() => {
    const results = placeData["파리"].filter(item =>
      item.name.toLowerCase().includes(pick.toLowerCase())
    );
    setFilteredData(results);
  }, [pick]);

  return (
    <div className="w-full p-4 space-y-4">
      {filteredData.map((location) => (
        <div 
          className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100 transition" 
          draggable="true" 
          key={location.id} 
          onDragStart={() => onDragStart(location)}
        >
          <div className="flex flex-col justify-center h-full">
            <div className="text-lg font-semibold">{location.name}</div>
            <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              {location.address}
            </div>
            <div className="hidden time mt-2 flex items-center space-x-2">
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
