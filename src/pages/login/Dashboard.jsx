import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Dashboard() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const accessToken = Cookies.get("access");
    const refreshToken = Cookies.get("refresh");

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
    } else {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {accessToken && refreshToken ? (
        <div>
          <p>Access Token: {accessToken}</p>
          <p>Refresh Token: {refreshToken}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;