import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import './Signup.css'

function Signup() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    userId:'',
    firstName: '',
    lastName: '',
    middleName: '',
    userName: '',
    password: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function Login(){
    navigate('/');
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleCloseSnackbar() {
    setOpenSnackbar(false);
  }
  
  function handleTogglePasswordVisibility() {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }

  async function handleAddUser() {
    try {
      const { data: users } = await axios.get("http://localhost:1337/fetchusers");
      const exists = users.some(user => user.userName === formData.userName);
  
      if (exists) {
        alert("Username already exists!");
        return;
      }
      
      await axios.post("http://localhost:1337/adduser", formData);
      console.log("Successfully Added User: ", formData);

      // Show success notification
      setOpenSnackbar(true);

      // Reset form after successful registration
      setFormData({
        userId:'',
        firstName: '',
        lastName: '',
        middleName: '',
        userName: '',
        password: ''
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }

  return (
    <>
      <div className='signup'>
        <div className='signup-box'>
          <h2>Create Student Account</h2>
          <TextField 
            name='userId'
            label="User Id"
            value={formData.userId}
            onChange={handleChange}
          />

          <TextField 
            name='firstName'
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <TextField 
            name='lastName'
            label="Last Name" 
            value={formData.lastName}
            onChange={handleChange}
          />
          
          <TextField 
            name='userName'
            label="Username"
            value={formData.userName}
            onChange={handleChange}
          />
          
          <TextField 
            name='password'
            label="Password" 
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
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
          
          <Button 
          className='subButt'
            type='submit'
            variant='contained'
            onClick={handleAddUser}
          >
            Create Account
          </Button>
          
          <div className='register'>
            <p>Already have an account? <a href=" " onClick={Login}>Log in</a></p>
          </div>
        </div>
      </div>
      
      {/* Success Notification */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Registration successful! You can now log in.
        </Alert>
      </Snackbar>
    </>
  )
}

export default Signup