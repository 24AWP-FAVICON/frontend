import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import Sidebar from "./Sidebar";
import "./Plan.css";

const containerStyle = {
  width: "100%",
  height: "96vh",
};

function Plan() {
  const location = useLocation();
  const [center, setCenter] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placesData, setPlacesData] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.center && location.state.center.coords) {
      setCenter({
        lat: location.state.center.coords.lat,
        lng: location.state.center.coords.lng,
      });
    } else {
      console.error("Invalid location state");
    }
  }, [location]);

  const onLoad = (map) => {
    mapRef.current = map;
    searchNearbyPlaces(map.getCenter());
  };

  const searchNearbyPlaces = (location) => {
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: location,
      radius: '2000',
      type: ['lodging']
    };
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
        const placesInfo = results.map(place => ({
          name: place.name,
          address: place.vicinity,
          location: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        }));
        setPlacesData(placesInfo);
      } else {
        console.error("Places search failed: ", status);
      }
    });
  };

  const handleDragEnd = useCallback(() => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      const newCenterLat = newCenter.lat();
      const newCenterLng = newCenter.lng();

      if (newCenterLat !== center.lat || newCenterLng !== center.lng) {
        setCenter({
          lat: newCenterLat,
          lng: newCenterLng,
        });
        searchNearbyPlaces(newCenter);
      }
    }
  }, [center]);

  if (!center) {
    return <div>지도를 표시할 위치 정보가 없습니다.</div>;
  }

  return (
    <div className="plan-container flex-initial">
      <Sidebar placesData={placesData} locationName={location.state.locationName} />
      <div className="map">
        <div className="map flex align-middle justify-center" style={{ width: "100%", height: "100%" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onLoad={onLoad}
            onDragEnd={handleDragEnd}
          >
            {places.map((place) => (
              <Marker
                key={place.place_id}
                position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {selectedPlace && (
              <InfoWindow
                position={{ lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng() }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h2>{selectedPlace.name}</h2>
                  <p>{selectedPlace.vicinity}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default Plan;