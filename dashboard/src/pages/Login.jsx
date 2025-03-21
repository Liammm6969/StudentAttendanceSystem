import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Login() {
  const [formData, setFormData] = useState({ userName: '', password: '' });
  const navigate = useNavigate(); 

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
