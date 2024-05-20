import React from "react";
import { useNavigate } from "react-router-dom";
import locationsData from "./location.json";
import "./Section3.css";

const Section3 = () => {
  const navigate = useNavigate();

  const handleCardClick = (location) => {
    navigate("/plan", { state: { center: { coords: location.coords } } });
  };

  return (
    <section className="section3">
      <div className="cards-container-section3">
        {locationsData.map((location) => (
          <div className="card-section3" key={location.id} onClick={() => handleCardClick(location)}>
            <h3 className="country-section3">{location.country}</h3>
            <p className="location-section3">{location.location}</p>
            <img className="image-section3" src={`${process.env.PUBLIC_URL}/Location_images/${location.location}.jpg`} alt={location.location} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section3;
