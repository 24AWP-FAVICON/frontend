import React from "react";
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function Login(){
    
    return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      );
}

export default Login;