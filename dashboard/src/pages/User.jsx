import React, { useState, useEffect } from 'react';
import './User.css';
import Sidebar from './Sidebar.jsx';
import TextField from '@mui/material/TextField';
import { Button, Modal, Box, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton as MuiIconButton, Fade, Tooltip } from '@mui/material/';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

function User() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    middleName: '',
    userName: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data } = await axios.get("http://localhost:1337/fetchusers");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      fetchUsers();
      console.log("Successfully Added User: ", formData);
      setOpenAdd(false);
      setFormData({
        userId: '',
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

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:1337/deleteuser/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleSaveChanges() {
    if (!editingUser) return;
    try {
      await axios.put(`http://localhost:1337/updateuser/${editingUser.userId}`, formData);
      fetchUsers();
      setOpenEdit(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setFormData(user);
    setOpenEdit(true);
  }

  function handleOpenAddModal() {
    setEditingUser(null);
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      userName: '',
      password: ''
    });
    setOpenAdd(true);
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderUserTable = () => {
    if (users.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Users Found</h3>
          <p>There are no users in the system. Click the button below to add your first user.</p>
          <Button 
            variant="contained" 
            startIcon={<PersonAddAlt1Icon />}
            className="empty-state-button"
            onClick={handleOpenAddModal}
          >
            Add First User
          </Button>
        </div>
      );
    }

    return (
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Middle Name</th>
            <th>Username</th>
            <th>Password</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.middleName}</td>
              <td>{user.userName}</td>
              <td>{user.password}</td>
              {/* <td>{'-'.repeat(6)}</td> */}
              {/* <td className="table-actions">
                <Tooltip
                title="Edit"
                >
                <Button onClick={() => handleEdit(user)}>
                  <EditIcon fontSize="small" />
                </Button> 
                </Tooltip>
                <Tooltip
                title="Delete"
                >
                <Button onClick={() => handleDelete(user.userId)}>
                  <PersonRemoveIcon fontSize='small'/>
                </Button>
                </Tooltip>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Sidebar />
      <div className='container'>
        <div className='userInfo'>
          <h2>User Management</h2>
          {/* <IconButton className='addButt' onClick={handleOpenAddModal}>
            <PersonAddAlt1Icon />
          </IconButton> */}
          {renderUserTable()}
        </div>
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Fade in={openAdd}>
          <Box className='modal-box'>
            <h2>Add User</h2>
            <TextField 
              name='userId' 
              label="User ID" 
              value={formData.userId} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='firstName' 
              label="First Name" 
              value={formData.firstName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='lastName' 
              label="Last Name" 
              value={formData.lastName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='middleName' 
              label="Middle Name" 
              value={formData.middleName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='userName' 
              label="Username" 
              value={formData.userName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <MuiIconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </MuiIconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <div className="modal-buttons">
              <Button variant="contained" color="primary" onClick={handleAddUser}>Add User</Button>
              <Button variant="outlined" onClick={() => setOpenAdd(false)}>Cancel</Button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Fade in={openEdit}>
          <Box className='modal-box'>
            <h2>Edit User</h2>
            <TextField 
              name='userId' 
              label="User ID" 
              value={formData.userId} 
              onChange={handleChange} 
              disabled
              fullWidth
              margin="normal"
            />
            <TextField 
              name='firstName' 
              label="First Name" 
              value={formData.firstName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='lastName' 
              label="Last Name" 
              value={formData.lastName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='middleName' 
              label="Middle Name" 
              value={formData.middleName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <TextField 
              name='userName' 
              label="Username" 
              value={formData.userName} 
              onChange={handleChange} 
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel htmlFor="edit-password">Password</InputLabel>
              <OutlinedInput
                id="edit-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <MuiIconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </MuiIconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <div className="modal-buttons">
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
              <Button variant="outlined" onClick={() => setOpenEdit(false)}>Cancel</Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default User;
