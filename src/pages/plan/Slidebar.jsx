import {useEffect} from 'react';

function Slidebar(){
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
    <div className="slidebar_">
      <div>
        <p><b>Planner</b></p>
        <button><a id="init">장소초기화</a></button>
      </div>
      <div>
        <div className='container'>
          장소를 드롭해주세요
        </div>
      </div>
    </div>
  )
}

export default Slidebar