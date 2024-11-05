import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login.js

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                localStorage.setItem('username', username); // username을 localStorage에 저장
                navigate('/mypage'); // 로그인 후 마이페이지로 이동
            } else {
                alert(data.error || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
        }
    };
  

  const goToRegister = () => {
    navigate('/register'); // 회원가입 화면으로 이동
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={titleStyle}>로그인</h1>
        <form onSubmit={handleLogin} style={formStyle}>
          <div style={inputContainerStyle}>
            <label>사용자 이름:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={inputContainerStyle}>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle}>로그인</button>
          <button type="button" onClick={goToRegister} style={{ ...buttonStyle, marginTop: '10px' }}>
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}

// 스타일 설정
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
};

const loginBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '300px',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '24px',
};

const formStyle = {
  width: '100%',
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
  width: '100%',
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
};

export default Login;
