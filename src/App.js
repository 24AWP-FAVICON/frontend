import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Section from "./pages/home/Sections";
import SNS from "./pages/sns/Sns";
import Plan from "./pages/plan/Plan";
import Login from "./pages/login/Login";

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Section />} />
            <Route path="/sns" element={<SNS />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
