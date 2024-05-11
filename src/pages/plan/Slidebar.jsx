import { useState,useEffect } from 'react';

function Slidebar(){
  const [isClick, setIsClick] = useState(false);
  let planner = <div className="container"></div>;
  let p = <div></div>;
  

  return(
    <div className="slidebar_">
      <div>
        <p><b>Planner</b></p>
      </div>
      <div>
        {isClick ? p:planner}
      </div>
    </div>
  )
}

export default Slidebar