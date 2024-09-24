import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/header/Header";
import Footer from "./pages/Footer/Footer";
import Section from "./pages/home/Sections";
import SNS from "./pages/sns/Sns";
import Plan from "./pages/plan/Plan";
import Login from "./pages/login/Login";
import Community from "./pages/community/Community";
import LoginSuccess from "./pages/login/LoginSuccess";
import Dashboard from "./pages/login/Dashboard";
import UserProfile from "./pages/userprofile/UserProfile";
import "./Frontend_API";
import "./App.css";
import { LoadScript } from "@react-google-maps/api";
import TripPage from "./pages/trip/TripPage";

function App() {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Section />} />
              <Route path="/userprofile" element={<UserProfile></UserProfile>}></Route>
              <Route path="/sns" element={<SNS />} />
              <Route path="/plan" element={<Plan />} />
              <Route path="/trip" element={<TripPage />} />
              <Route path="/community" element={<Community />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/success" element={<LoginSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LoadScript>
  );
}

export default App;