function SelectTime(){
  let date = 2;
  let tr = <tr><td>5/1</td><td>수</td></tr>;
  return(
    <div className="selectTimeElement">
      <div>
        <input type="date" />
        ~
        <input type="date" />
      </div>
      <div>
        <table>
          <tr>
            <td>일자</td>
            <td>요일</td>
          </tr>
          {tr}
          {tr}
        </table>
      </div>
      
      <div>
        <button>시간 설정 완료</button>
      </div>
    </div>
  );
}

export default SelectTime