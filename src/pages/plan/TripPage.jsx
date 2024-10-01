import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tripIdDetailGet, tripIdGet } from "./PlanApiService";
import { FaBed } from "react-icons/fa";
import { FaLocationDot, FaSackDollar } from "react-icons/fa6";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"; // Google Maps 관련 import

const containerStyle = {
  width: '100%',
  height: '58vh',
};

const center = {
  lat: 37.7749, // 기본 중앙 위치 (위도)
  lng: -122.4194, // 기본 중앙 위치 (경도)
};

const TripPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tripInfo, setTripInfo] = useState();
  const [tripDetailInfo, setTripDetailInfo] = useState();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]); // 지도에 표시할 장소들

  const tripId = searchParams.get("tripId");

  useEffect(() => {
    if (tripId) {
      const getTripInfo = async () => {
        try {
          const newTripInfo = await tripIdGet(tripId);
          const newTripDetailInfo = await tripIdDetailGet(tripId);
          setTripInfo(newTripInfo.data);
          setTripDetailInfo(newTripDetailInfo);
          // 장소 정보를 state에 설정
          const tripPlaces = newTripDetailInfo.data.flatMap(detail => 
            detail.locations.map(loc => ({
              place_id: loc.id,
              name: loc.locationName,
              geometry: { location: { lat: () => loc.lat, lng: () => loc.lng } },
              vicinity: loc.address, // 예시로 주소 설정
            }))
          );
          setPlaces(tripPlaces);
        } catch (error) {
          console.error("Failed to fetch trip info: ", error);
        }
      };
      getTripInfo();
    }
  }, [tripId]);

  if (!tripInfo || !tripDetailInfo) return <></>;

  const handleDragEnd = () => {
    console.log("Map dragged");
  };

  const onLoad = (map) => {
    console.log("Map loaded:", map);
  };

  return (
    <div className="w-full h-full p-6 bg-gradient-to-r">
      <div className="flex w-full h-full gap-6">
        {/* 왼쪽 여행 정보 카드 */}
        <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
          <div>
            <div className="flex items-center gap-2 text-4xl font-extrabold text-blue-600">
              {tripInfo.tripName}
              <span className="text-sm font-semibold text-gray-500">
                {tripInfo.startDate} ~ {tripInfo.endDate}
              </span>
            </div>
          </div>

          <div className="flex w-full justify-between pr-20 pt-6 border-t border-gray-200 mt-4">
            <span className="flex items-center gap-3 text-2xl font-semibold">
              <FaSackDollar className="text-yellow-500" />
              {tripInfo.budget.toLocaleString()}원
            </span>
            <span className="flex items-center gap-2 text-gray-700">
              <span className="font-semibold text-lg">참가자:</span>
              {tripInfo.participantIds?.map((id) => (
                <span key={id} className="px-2 py-1 bg-gray-100 rounded-lg">
                  {id}
                </span>
              ))}
            </span>
          </div>

          <div className="flex w-full gap-6 pt-6 overflow-x-auto scrollbar-hide">
            {tripDetailInfo.data.map((info, index) => (
              <div
                key={index}
                className="flex flex-col gap-4 min-w-[300px] p-4 bg-gray-100 shadow-sm rounded-lg"
              >
                <div className="flex w-full justify-between">
                  <span className="font-semibold text-xl ">{info.tripDay}일차</span>
                  <span className="text-sm font-semibold ">{info.tripDate}</span>
                </div>
                <span className="flex items-center font-semibold text-lg gap-2">
                  <FaSackDollar className="text-yellow-500" />
                  {info.budget.toLocaleString()}원
                </span>
                {/* <div className="flex gap-2 items-center text-lg font-semibold ">
                  <FaBed className="text-purple-600" />
                  {info.accommodation.accommodationName}
                </div> */}
                <div className="gap-2 font-semibold text-md">
                  {info.locations.map((loc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FaLocationDot className="text-red-600" />
                      {loc.locationName}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Map 컴포넌트 오른쪽에 배치 */}
        <div className="flex w-1/2 h-full">
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
};

export default TripPage;
