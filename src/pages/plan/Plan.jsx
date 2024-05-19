import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Sidebar from "./Sidebar";
import "./Plan.css";

const containerStyle = {
  width: "100%",
  height: "813px",
};

function Plan() {
  const location = useLocation();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [center, setCenter] = useState(null);

  useEffect(() => {
    const script = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (script) {
      setIsScriptLoaded(true);
    } else {
      setIsScriptLoaded(false);
    }

    if (location.state && location.state.center && location.state.center.coords) {
      setCenter({
        lat: location.state.center.coords.lat,
        lng: location.state.center.coords.lng,
      });
    } else {
      console.error("Invalid location state");
    }
  }, [location]);

  if (!center) {
    return <div>지도를 표시할 위치 정보가 없습니다.</div>;
  }

  const handleLoadError = (error) => {
    console.error("Error loading Google Maps API script:", error);
  };

  return (
    <div className="plan-container">
      <Sidebar />
      <div className="map">
        {isScriptLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          />
        ) : (
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            onLoad={() => setIsScriptLoaded(true)}
            onError={handleLoadError}
            loadingElement={<div>Loading...</div>}
            id="script-loader"
            async
            defer
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
            />
          </LoadScript>
        )}
      </div>
    </div>
  );
}

export default Plan;