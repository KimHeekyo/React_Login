// backend/index.js
// db 불러오기
require('dotenv').config();



const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt'); // 비밀번호 암호화를 위해 bcrypt 사용

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL 연결 설정
const pool = new Pool({
    user: 'postgres',
    host: process.env.DB_HOST,
    database: 'React',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// 회원가입 API 엔드포인트
app.post('/api/register', async (req, res) => {
  const { username, password, name, birth, pnum, email } = req.body;

  try {
    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 삽입
    const userResult = await pool.query(
      `INSERT INTO users (username, password_hash, name, birth, pnum, email) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [username, hashedPassword, name, birth, pnum, email]
    );

    const user = userResult.rows[0];

    // password_history 테이블에 초기 비밀번호 추가
    await pool.query(
      `INSERT INTO password_history (user_id, password_hash) VALUES ($1, $2)`,
      [user.id, hashedPassword]
    );

    res.status(201).json({ message: '사용자가 성공적으로 등록되었습니다.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
});

// 모든 사용자 조회 API 엔드포인트
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
});

// 로그인 API 엔드포인트
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // DB에서 사용자 조회
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
    }

    const user = result.rows[0];

    // 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    // 로그인 성공 시 사용자 정보와 메시지 반환
    res.json({ message: '로그인 성공', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 로그인된 사용자 정보를 반환하는 API 예제
app.get('/api/users/me', async (req, res) => {
  try {
    const username = req.query.username; // 클라이언트에서 전달한 사용자 이름을 사용하거나, 토큰 등을 통해 식별
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 비밀번호 변경 API 엔드포인트
app.post('/api/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // 사용자 조회
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
    }

    const user = userResult.rows[0];

    // 현재 비밀번호 검증
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 최근 3개의 비밀번호 조회
    const historyResult = await pool.query(
      `SELECT password_hash FROM password_history 
       WHERE user_id = $1 
       ORDER BY changed_at DESC 
       LIMIT 3`,
      [user.id]
    );

    // 최근 사용한 비밀번호와 중복 체크
    for (let row of historyResult.rows) {
      const isDuplicate = await bcrypt.compare(newPassword, row.password_hash);
      if (isDuplicate) {
        return res.status(400).json({ error: '최근 사용한 비밀번호와 중복될 수 없습니다.' });
      }
    }

    // 새 비밀번호 암호화
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedNewPassword, user.id]);

    // password_history 테이블에 새 비밀번호 추가
    try {
      await pool.query(
        `INSERT INTO password_history (user_id, password_hash) VALUES ($1, $2)`,
        [user.id, hashedNewPassword]
      );
    } catch (insertError) {
      console.error("Failed to insert into password_history:", insertError);
    }

    // 비밀번호 이력에서 3개를 초과하면 가장 오래된 기록 삭제
    await pool.query(
      `DELETE FROM password_history 
       WHERE user_id = $1 
       AND id NOT IN (
         SELECT id FROM password_history 
         WHERE user_id = $1 
         ORDER BY changed_at DESC 
         LIMIT 3
       )`,
      [user.id]
    );

    res.json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (err) {
    console.error("Error in password change:", err);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
