import './SelectPlace.css'
import React, { useEffect } from 'react';

function SelectPlace(){
  useEffect(() => {
    const draggables = document.querySelectorAll('.draggable');
    const containers = document.querySelectorAll('.container');

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

  return(
    <div className="selectPlaceElement">
      <div className="draggable" draggable="true">
        <div className="num"></div>
        <div className="info">
          <div>돌하르방</div>
          <div>제주도 서귀포시 182</div>
          
        </div>
      </div>
      <div className="draggable" draggable="true">
        <div className="num"></div>
        <div className="info">
          <div>천지연폭포</div>
          <div>제주도 서귀포시 18-1</div>
        </div>
      </div>
      <div className="draggable" draggable="true">
        <div className="num"></div>
        <div className="info">
          <div>정방폭포</div>
          <div>제주도 서귀포시 82-1</div>
        </div>
      </div>
    </div>
  );
}

export default SelectPlace