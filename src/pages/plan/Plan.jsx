import React from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "55em",
  height: "55em",
};

function Plan() {
  const location = useLocation();

  if (!location.state || !location.state.center || !location.state.center.coords) {
    console.error('Invalid location state');
    return <div>지도를 표시할 위치 정보가 없습니다.</div>;
  }

  const center = {
    lat: location.state.center.coords.lat,
    lng: location.state.center.coords.lng,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      ></GoogleMap>
    </LoadScript>
  );
}

export default Plan;
