import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { tripIdDetailGet, tripIdGet } from "../plan/PlanApiService";
import {FaBed} from "react-icons/fa"
import {FaLocationDot, FaSackDollar} from "react-icons/fa6"

const TripPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tripInfo, setTripInfo] = useState();
    const [tripDetailInfo, setTripDetailInfo] = useState();
    
    console.log(tripInfo, tripDetailInfo)
    const tripId = searchParams.get("tripId");
  
    useEffect(() => {
        if (tripId) {
          const getTripInfo = async () => {
            try {
              const newTripInfo = await tripIdGet(tripId);
              const newTripDetailInfo = await tripIdDetailGet(tripId);
              setTripInfo(newTripInfo.data);
              setTripDetailInfo(newTripDetailInfo);
    
            } catch (error) {
              console.error("Failed to fetch trip info: ", error);
            }
          };
          getTripInfo();
        }
    }, []);

    if(!tripInfo) return <></>;

    return (
    /* Tailwind CSS를 사용한 예쁜 스타일 */
<div className="w-full h-full p-6 bg-gradient-to-r from-blue-50 to-white">
    <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-6">
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
                <FaSackDollar className="text-yellow-500"/>
                {tripInfo.budget.toLocaleString()}원
            </span>
            <span className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold text-lg">참가자:</span>
                {tripInfo.participantIds?.map(id => <span key={id} className="px-2 py-1 bg-gray-100 rounded-lg">{id}</span>)}
            </span>
        </div>

        <div className="flex w-full gap-6 pt-6 overflow-x-auto scrollbar-hide">
            {tripDetailInfo.data.map((info, index) => (
                <div key={index} className="flex flex-col gap-4 w-[300px] p-4 bg-gray-100 shadow-sm rounded-lg">
                    <div className="flex w-full justify-between">
                        <span className="font-semibold text-xl ">{info.tripDay}일차</span>
                        <span className="text-sm font-semibold ">{info.tripDate}</span>
                    </div>
                    <span className="flex items-center font-semibold text-lg gap-2">
                        <FaSackDollar className="text-yellow-500"/>
                        {info.budget.toLocaleString()}원
                    </span>
                    <div className="flex gap-2 items-center text-lg font-semibold ">
                        <FaBed className="text-purple-600"/>
                        {info.accommodation.accommodationName}
                    </div>
                    <div className="gap-2 font-semibold text-md">
                        {info.locations.map((loc, index) => <div key={index} className="flex items-center gap-2">
                            <FaLocationDot className="text-red-600"/>
                            {loc.locationName}
                        </div>)}
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>

        )
}

export default TripPage;
