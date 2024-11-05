import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 비밀번호 확인 필드 추가
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [pnum, setPnum] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState(''); // 비밀번호 에러 메시지
  const navigate = useNavigate();

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    // 최소 하나의 숫자와 하나의 특수문자를 포함하고, 길이가 8~16자여야 함
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,16}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 시 실시간 유효성 검사
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    // 비밀번호가 비어 있으면 에러 메시지를 제거
    if (password === '') {
      setPasswordError('');
    } else if (!validatePassword(password)) {
      setPasswordError('비밀번호는 8자리 이상 16자리 이하, 숫자와 특수문자를 포함해야 합니다.');
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordError) {
      alert('비밀번호 조건을 만족하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name,
          birth,
          pnum,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login'); // 회원가입 후 로그인 페이지로 이동
      } else {
        alert(data.error || '회원가입 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={signupBoxStyle}>
        <h1 style={titleStyle}>회원가입</h1>
        <form onSubmit={handleSignup} style={formStyle}>
          <input
            type="text"
            placeholder="ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange} // 비밀번호 유효성 검사 적용
            style={inputStyle}
            required
          />
          {passwordError && (
            <span style={errorStyle}>{passwordError}</span>
          )}
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="생년월일"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="전화번호"
            value={pnum}
            onChange={(e) => setPnum(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>회원가입</button>
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

const signupBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  maxWidth: '400px',
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

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  width: '100%',
  marginBottom: '15px',
  margintop: '15px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ddd',
};

const errorStyle = {
  color: 'red',
  fontSize: '12px',
  marginTop: '5px',
  marginBottom: '15px', // 아래 여백 추가
  textAlign: 'center',  // 가운데 정렬 추가
  display: 'block',     // 블록 요소로 설정하여 전체 너비 차지
};



const buttonStyle = {
  padding: '12px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  width: '100%',
};

export default Signup;
