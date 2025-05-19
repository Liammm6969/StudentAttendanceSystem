import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../config/axios';
import validator from 'validator';
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
  const [errors, setErrors] = useState({
    userId:'',
    firstName: '',
    lastName: '',
    middleName: '',
    userName: '',
    password: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "Registration successful! You can now log in.",
    type: "success"
  });

  function Login(){
    navigate('/login');
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function handleCloseSnackbar() {
    setNotification(prev => ({ ...prev, open: false }));
  }
  
  function handleTogglePasswordVisibility() {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    if (validator.isEmpty(formData.userId)) {
      newErrors.userId = "User ID is required";
      isValid = false;
    } else if (!validator.isNumeric(formData.userId)) {
      newErrors.userId = "User ID must contain only numbers";
      isValid = false;
    }
    if (validator.isEmpty(formData.firstName)) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (!validator.isAlpha(formData.firstName)) {
      newErrors.firstName = "First name should contain only letters";
      isValid = false;
    }
    if (validator.isEmpty(formData.lastName)) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (!validator.isAlpha(formData.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
      isValid = false;
    }
    if (formData.middleName && !validator.isAlpha(formData.middleName)) {
      newErrors.middleName = "Middle name should contain only letters";
      isValid = false;
    }
    if (validator.isEmpty(formData.userName)) {
      newErrors.userName = "Username is required";
      isValid = false;
    }
    if (validator.isEmpty(formData.password)) {
      newErrors.password = "Password is required";
      isValid = false;
    } 
    setErrors(newErrors);
    return isValid;
  }

  function showNotification(message, type) {
    setNotification({
      open: true,
      message,
      type,
    });
  }

  async function handleAddUser() {
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    try {
      await api.post("/api/auth/register", formData);
      console.log("Successfully Added User: ", formData);
      
      showNotification("Registration successful! Redirecting to login...", "success");
   
      setFormData({
        userId:'',
        firstName: '',
        lastName: '',
        middleName: '',
        userName: '',
        password: ''
      });
      setErrors({
        userId:'',
        firstName: '',
        lastName: '',
        middleName: '',
        userName: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error("Error adding user:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
      showNotification(errorMessage, "error");
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
            error={!!errors.userId}
            helperText={errors.userId}
            fullWidth
            margin="normal"
          />

          <TextField 
            name='firstName'
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
            fullWidth
            margin="normal"
          />

          <TextField 
            name='middleName'
            label="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            error={!!errors.middleName}
            helperText={errors.middleName}
            fullWidth
            margin="normal"
          />

          <TextField 
            name='lastName'
            label="Last Name" 
            value={formData.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
            fullWidth
            margin="normal"
          />
          
          <TextField 
            name='userName'
            label="Username"
            value={formData.userName}
            onChange={handleChange}
            error={!!errors.userName}
            helperText={errors.userName}
            fullWidth
            margin="normal"
          />
          
          <TextField 
            name='password'
            label="Password" 
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
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
            fullWidth
          >
            Create Account
          </Button>
          
          <div className='register'>
            <p>Already have an account? <a href="#" onClick={Login}>Log in</a></p>
          </div>
        </div>
      </div>
 
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={notification.type} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Signup 