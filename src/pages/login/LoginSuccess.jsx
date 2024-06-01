import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";

function LoginSuccess() {
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    }, []);

    return (
        <div>
            <h1>Login Successful</h1>
            <p>Access Token: {accessToken}</p>
            <p>Refresh Token: {refreshToken}</p>
        </div>
    );
}

export default LoginSuccess;