import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3003/api/login', { username, password });

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user?._id)
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Tên người dùng hoặc mật khẩu không đúng.');
    }
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }

          .lr-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 300px;
            text-align: center;
            margin: 0 auto;
          }

          .lr-container input {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: 1px solid #ddd;
            font-size: 16px;
            box-sizing: border-box;
          }

          .lr-container button {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            border: none;
            background-color: #4CAF50;
            color: white;
            font-size: 16px;
            cursor: pointer;
            box-sizing: border-box;
          }

          .lr-container button:hover {
            background-color: #45a049;
          }

          .lr-container p {
            font-size: 14px;
            text-align: center;
            margin-top: 10px;
          }

          .lr-container p span {
            font-size: 14px;
            color: #007BFF;
            text-decoration: underline;
            cursor: pointer;
          }

          .error-message {
            color: red;
            font-size: 14px;
            margin-top: 10px;
          }
        `}
      </style>

      <div className="lr-container">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        {error && <div className="error-message">{error}</div>} {/* Hiển thị lỗi nếu có */}

        <div>
          <p>
            Bạn chưa có tài khoản?{' '}
            <span onClick={navigateToRegister}>Hãy đăng ký</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
