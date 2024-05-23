import React from "react";
import loginImage from './google_logo.png'; // 컴포넌트 파일과 같은 폴더에 있는 이미지 파일

function Login() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ marginBottom: '20px' }}>Sign in to Figma</h1>
            <button style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
                <img 
                    src={loginImage} 
                    alt="Google Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '10px' }}
                />
                <span style={{ fontSize: '14px', color: '#555' }}>Continue with Google</span>
            </button>
        </div>
    );
}

export default Login;