import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import LoginIcon from '@mui/icons-material/Login';
import { Button, IconButton, Snackbar, Alert, InputAdornment, TextField } from '@mui/material';
import axios from 'axios';
import './Login.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import SchoolIcon from '@mui/icons-material/School';

function Login() {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setLoginError(false);
  }

  function handleTogglePasswordVisibility() {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }
  function Signup(){
    navigate('/signup');
  }
  async function handleLogin(event) {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:1337/login', formData);
      navigate('/home'); 
    } catch (error) {
      setLoginError(true);
      console.error("Login error:", error);
    }
  }

  return (
    <div className='login'>
      <div className='login-box'>
        <div className="logo-container">
          <SchoolIcon className="school-icon" />
        </div>
       
        <h2>Student Information System</h2>

          <div className="input-group">
            <label>Username</label> <br />
            <TextField
              type="text"
              name="userName"
              placeholder="Enter your username"
              value={formData.userName}
              onChange={handleChange}
              required
              className={loginError ? 'error' : ''}
            />
          </div>
          <div className="input-group">
            <label>Password</label> <br />
            <TextField
  type={showPassword ? "text" : "password"}
  name="password"
  placeholder="Enter your password"
  value={formData.password}
  onChange={handleChange}
  required
  className={loginError ? 'error' : ''}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={handleTogglePasswordVisibility}
          edge="end"
          sx={{ color: 'var(--text-color)' }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

          </div>

          {loginError && (
            <div className="error-message">
              Invalid username or password
            </div>
          )}

          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>

          <Button 
          className='Butt'
            variant="contained" 
            type="submit" 
            startIcon={<LoginIcon/>}
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
          <div className='register'>
          <a href=" " onClick={Signup}>Register Account</a>
          </div>
      </div>
    </div>
  );
}

export default Login;