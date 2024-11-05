// src/ChangePassword.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 메시지
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username'); // username 가져오기

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 시 실시간 유효성 검사
  const handleNewPasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);

    // 조건을 만족하지 않으면 에러 메시지를 설정
    if (!validatePassword(password)) {
      setPasswordError('비밀번호는 8자리 이상 16자리 이하, 숫자와 특수문자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordError) {
      alert('비밀번호 조건을 만족하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // 성공 메시지

        // 로그아웃 여부를 묻는 confirm 창
        const shouldLogout = window.confirm('로그아웃하시겠습니까?');

        if (shouldLogout) {
          localStorage.removeItem('username');
          navigate('/login');
        } else {
          navigate('/mypage');
        }
      } else {
        alert(data.error); // 에러 메시지
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h2 style={titleStyle}>비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange} style={formStyle}>
          <div style={inputContainerStyle}>
            <label>현재 비밀번호:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={inputContainerStyle}>
            <label>새 비밀번호:</label>
            <input
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              style={inputStyle}
              required
            />
            {passwordError && (
              <span style={errorStyle}>{passwordError}</span>
            )}
          </div>
          <div style={inputContainerStyle}>
            <label>비밀번호 확인:</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle}>비밀번호 변경</button>
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
  fontFamily: 'Arial, sans-serif',
};

const formBoxStyle = {
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'left',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '24px',
  fontWeight: 'bold',
};

const formStyle = {
  width: '100%',
};

const inputContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
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

export default ChangePassword;
