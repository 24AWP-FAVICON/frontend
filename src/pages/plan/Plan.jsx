import React from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState } from "react";
import SelectPlace from "./SelectPlace";
import SelectTime from "./SelectTime";
import Slidebar from "./Slidebar";
import "./Plan.css";

const containerStyle = {
  width: "1230px",
  height: "813px",
};

function Plan() {
  const [isOpen, setIsOpen] = useState(true); // 사이드바 상태(state) 추가
  const [isTime, isPlace] = useState(false); // 시간선택 or 장소선택
  const [selectedDates, setSelectedDates] = useState(['2024-04-12', '2024-04-13']);
  const location = useLocation(); // 위치 정보 가져오기

  // 사이드바를 열고 닫는 함수
  const toggleSlidebar = () => {
    setIsOpen(!isOpen);
  };
  const selectTime = () => {
    if (isTime) {
      isPlace(!isTime);
    }
  };
  const selectPlace = () => {
    if (!isTime) {
      isPlace(!isTime);
    }
  };
  const [sidebarWidth, setSidebarWidth] = useState("250px");
  // 위치 정보 검증
  if (
    !location.state ||
    !location.state.center ||
    !location.state.center.coords
  ) {
    console.error("Invalid location state");
    return <div>지도를 표시할 위치 정보가 없습니다.</div>;
  }

  const center = {
    lat: location.state.center.coords.lat,
    lng: location.state.center.coords.lng,
  };

  return (
    <div className="plan-container">
      <div className="sidebar">
        <div className="loc">제주</div>
        <div className="search">
          <input
            id="name"
            type="text"
            placeholder="장소나 숙소를 검색하세요."
          />
        </div>
        <div className="button">
          <button onClick={selectTime} className={`${!isTime ? "click" : ""}`}>
            시간선택
          </button>
          <button onClick={selectPlace} className={`${isTime ? "click" : ""}`}>
            장소선택
          </button>
        </div>
        <div className="block">{isTime ? <SelectPlace /> : <SelectTime />}</div>
        <div className={`slidebar ${isOpen ? "open" : ""}`}>
          <Slidebar selectedDates={selectedDates} />
        </div>
        <div className="toggle-button" onClick={toggleSlidebar}>
          <b>{isOpen ? "<" : ">"}</b>
        </div>
      </div>
      <div className="map">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        ></GoogleMap>
      </LoadScript>
      </div>
    </div>
  );
}

export default Plan;
