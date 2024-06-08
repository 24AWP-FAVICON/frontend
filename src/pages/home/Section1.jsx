import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Section1.css";
import locationsData from "./location.json";

const Section1 = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    setLocations(locationsData);

    const handlePageClick = (event) => {
      if (showSearch && !event.target.closest(".search-input, .search-button")) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handlePageClick);
    document.removeEventListener("mousedown", handlePageClick);
    document.addEventListener("click", handlePageClick);
    
    return () => {
      document.removeEventListener("mousedown", handlePageClick);
    };
  }, [showSearch]);

  const handleResultClick = (location, event) => {
    event.stopPropagation();
    navigate("/plan", {
      state: {
        loc: location,
        center: {
          coords: {
            lat: location.coords.lat,
            lng: location.coords.lng,
          },
        },
        locationName: location.location
      },
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLocations = locations.filter((location) =>
    location.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="h-screen flex bg-gray-50 justify-center items-center">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-center items-center -mt-10">
          <div className="flex-1 flex flex-col justify-center items-center md:items-start md:pl-5">
            <h2 className="text-4xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl mb-10 font-bold text-center md:text-left">함께 만들어가는</h2>
            <h2 className="text-4xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl mb-10 font-bold text-center md:text-left">여행 플랜 플랫폼</h2>
            <p className="text-2lg mb-10 text-gray-500 pl-2 text-center md:text-left">
              온라인에서 함께 손쉽게 스케줄을 만들어보세요.
            </p>
            {!showSearch && (
              <div className="search-container">
                <button
                  className="px-10 text-2xl py-6 ml-2 bg-black text-white rounded hover:bg-blue-900 transition-colors duration-300 search-button"
                  onClick={() => setShowSearch(true)}
                >
                  여행 계획 짜러가기
                </button>
              </div>
            )}
            {showSearch && (
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input search-input-active"
                  autoFocus
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <div className="search-results">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className="result-item hover:bg-gray-200 cursor-pointer"
                      onClick={(event) => handleResultClick(location, event)}
                    >
                      <div className="location">{location.location}</div>
                      <div className="country">{location.country}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 items-center justify-center hidden md:flex">
            <img
              src={`${process.env.PUBLIC_URL}/mainPage1.jpg`}
              alt="여행"
              className="w-auto h-128 rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;