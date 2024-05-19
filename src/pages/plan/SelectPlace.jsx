import './SelectPlace.css'
import { useState, useEffect } from 'react';
import placeData from "./place.json";

function SelectPlace({pick}){
  
  const [filteredData, setFilteredData] = useState(placeData);
  useEffect(() => {
    const results = placeData.filter(item =>
      item.location.toLowerCase().includes(pick.toLowerCase())
    );
    setFilteredData(results);
  }, [pick]);
  
  useEffect(() => {
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.container_');

    draggables.forEach(el => {
      el.addEventListener('dragstart', () => {
        el.classList.add('dragging');
      });

      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });
    });
    

    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    containers.forEach(container => {
      container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        container.insertBefore(draggable, afterElement);
      });
    });
  }, []);

  /* pick location */
  let doc = ''
  if (pick==''){
    doc = <div className="container_ list">
    {placeData.map((location) => (
      <div className="draggable" draggable="true">
        <div className="num"></div>
        <div className="info">
          <div>{location.location}</div>
          <div>{location.address}</div>
          <div className='time'>
            <input className='starttime' type="time" placeholder="00:00" />
            &nbsp;-&nbsp;
            <input className='endtime' type="time" placeholder="00:00" />
          </div>
        </div>
      </div>
    ))}
  </div>
  }
  else{
    doc = <div className="container_ list">
    {filteredData.map((location) => (
      <div className="draggable" draggable="true">
        <div className="num"></div>
        <div className="info">
          <div>{location.location}</div>
          <div>{location.address}</div>
          <div className='time'>
            <input className='starttime' type="time" placeholder="00:00" />
            &nbsp;-&nbsp;
            <input className='endtime' type="time" placeholder="00:00" />
          </div>
        </div>
      </div>
    ))}
  </div>
  }

  return(
    <div className="selectPlaceElement">
      {doc}
    </div>
      
  );
}

export default SelectPlace