function SelectTime(){
  const date = new Date();
  let year = date.getFullYear();
  let month = parseInt(date.getMonth()) + 1;
  let day = date.getDate();
  let startDate = year + "." + month + "." + day;
  let endDate = "2024.05.03";

  return(
    <div className="selectTimeElement">
      <div>
        <select name="month" id="">
          <option value="1">1</option>
          <option value="1">2</option>
          <option value="1">3</option>
          <option value="1">4</option>
          <option value="1">5</option>
          <option value="1">6</option>
          <option value="1">7</option>
          <option value="1">8</option>
          <option value="1">9</option>
          <option value="1">10</option>
        </select>
      </div>
      <div>
        <table>
          <tr>
            <td>일자</td>
            <td>요일</td>
          </tr>
          <tr>
            <td>5/1</td>
            <td>수</td>
          </tr>
          <tr>
            <td>5/2</td>
            <td>목</td>
          </tr>
          <tr>
            <td>5/3</td>
            <td>금</td>
          </tr>
        </table>
      </div>
      
      <div>
        <button>시간 설정 완료</button>
      </div>
    </div>
  );
}

export default SelectTime