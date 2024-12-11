import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState(''); // Thêm state cho địa chỉ
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3003/api/register', { username, email, password, address });
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
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
        `}
      </style>
      <div className="lr-container">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)} // Thêm input cho địa chỉ
        />
        <button onClick={handleRegister}>Register</button>

        <div>
          <p>
            Bạn đã có tài khoản?{' '}
            <span
              onClick={navigateToLogin}
              style={{
                color: '#007BFF',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Hãy đăng nhập
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
