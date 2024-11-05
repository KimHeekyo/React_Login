import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';  // 회원가입
import Login from './Login';  // 로그인
import MyPage from './MyPage'; // 마이페이지
import ChangePassword from './ChangePassword';  // 비밀번호 변경

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/mypage" element={<MyPage />} /> {/* 마이페이지 라우트 추가 */}
          {/* 기본 경로로 접속 시 로그인 페이지로 리디렉트 */}
          <Route path="/" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
