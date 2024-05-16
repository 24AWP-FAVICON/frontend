import React from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Plan.css";

const containerStyle = {
  width: "1230px",
  height: "813px",
};

function Plan() {
  const location = useLocation(); // 위치 정보 가져오기

 
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
      <Sidebar />
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
