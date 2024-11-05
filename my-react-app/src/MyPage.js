// src/MyPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('username이 없습니다.');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/me?username=${username}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('사용자 정보 불러오기 오류:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    alert('로그아웃 성공'); // 로그아웃 메시지 추가
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handlePasswordChange = () => {
    navigate('/change-password'); // 비밀번호 변경 페이지로 이동
  };


  if (!user) {
    return <div style={containerStyle}>사용자 정보를 불러오는 중입니다.</div>;
  }

  return (
    <div style={containerStyle}>
      <div style={infoBoxStyle}>
        <h2 style={titleStyle}>마이페이지</h2>
        <div style={infoRowStyle}><strong>사용자 이름:</strong> {user.username}</div>
        <div style={infoRowStyle}><strong>이름:</strong> {user.name}</div>
        <div style={infoRowStyle}><strong>생년월일:</strong> {user.birth}</div>
        <div style={infoRowStyle}><strong>전화번호:</strong> {user.pnum}</div>
        <div style={infoRowStyle}><strong>이메일:</strong> {user.email}</div>
        <div style={infoRowStyle}><strong>가입일:</strong> {new Date(user.created_at).toLocaleString()}</div>
        <div style={buttonContainerStyle}>
          <button onClick={handleLogout} style={buttonStyle}>로그아웃</button>
          <button onClick={handlePasswordChange} style={buttonStyle}>비밀번호 변경</button>
        </div>
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

const infoBoxStyle = {
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'left',
  marginBottom: '20px', // 버튼과 박스 사이 간격 추가
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '50px',
  fontSize: '30px',
  fontWeight: 'bold',
};

const infoRowStyle = {
  marginBottom: '40px', // 항목 간의 간격 추가
  fontSize: '20px',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '50px', // 버튼과 내용 사이 간격 추가
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  fontSize: '20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
  //maxWidth: '200px', // 버튼 크기 조정
};

export default MyPage;
