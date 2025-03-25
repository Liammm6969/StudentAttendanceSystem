import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import LoginIcon from '@mui/icons-material/Login';
import { Button, IconButton } from '@mui/material';
import axios from 'axios';
import './Login.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Login() {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:1337/login', formData);
      navigate('/home'); 
    } catch (error) {
      alert("Invalid username or password"); 
      console.error("Login error:", error);
    }
  }

  return (
    <div className='login'>
      <div className='login-box'>
        <h2>Student Information System</h2>  
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className='eyeIcon'>
            <IconButton onClick={() => setShowPassword(prev => !prev)}>
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            </span>

          </div>
          <Button variant="contained" type="submit" startIcon={<LoginIcon/>}>Login</Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
