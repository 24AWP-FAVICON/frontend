import { useState,useEffect } from 'react';

function Slidebar(){
  let planner = <div className="container_"></div>;
  let p = <div></div>;
  

  return(
    <div className="slidebar_">
      <div>
        <p><b>Planner</b></p>
      </div>
      <div>
        {planner}
      </div>
    </div>
  )
}

export default Slidebar