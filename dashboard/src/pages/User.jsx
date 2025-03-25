import React, { useState, useEffect } from 'react';
import './User.css';
import Sidebar from './Sidebar.jsx';
import TextField from '@mui/material/TextField';
import { Button, Modal, Box, IconButton } from '@mui/material/';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

function User() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
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
      await axios.post("http://localhost:1337/addusers", formData);
      fetchUsers();
      console.log("Successfuly Added User: ", formData)
      setOpenAdd(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }
  
  async function handleDelete(id){
    try{
      await axios.delete(`http://localhost:1337/deleteuser/${id}`);
      fetchUsers();
    } catch(error){
      console.error("Error deleting user", error)
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

  return (
    <>
      <Sidebar />
      <div className='container'>
        <div className='userInfo'>
          <h2>User Management</h2>
          <IconButton className='addButt' onClick={handleOpenAddModal}>
            <PersonAddAlt1Icon />
          </IconButton>
          <table className="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Name</th>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
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
                  <td className="table-actions">
                    <Button onClick={() => handleEdit(user)}>
                      <EditIcon fontSize="small" />
                    </Button> 
                    <Button onClick={() => handleDelete(user.userId)}>
                      <PersonRemoveIcon fontSize='small'/>
                      </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
        <Box className='modal-box'>
          <h2>Add User</h2>
          <TextField name='userId' label="User ID" value={formData.userId} onChange={handleChange} />
          <TextField name='firstName' label="First Name" value={formData.firstName} onChange={handleChange} />
          <TextField name='lastName' label="Last Name" value={formData.lastName} onChange={handleChange} />
          <TextField name='middleName' label="Middle Name" value={formData.middleName} onChange={handleChange} />
          <TextField name='userName' label="Username" value={formData.userName} onChange={handleChange} />
          <TextField name='password' label="Password" value={formData.password} onChange={handleChange} />
          <div className="modal-buttons">
            <Button onClick={handleAddUser}>Add User</Button>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>

      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box className='modal-box'>
          <h2>Edit User</h2>
          <TextField name='userId' label="User ID" value={formData.userId} onChange={handleChange} disabled/>
          <TextField name='firstName' label="First Name" value={formData.firstName} onChange={handleChange} />
          <TextField name='lastName' label="Last Name" value={formData.lastName} onChange={handleChange} />
          <TextField name='middleName' label="Middle Name" value={formData.middleName} onChange={handleChange} />
          <TextField name='userName' label="Username" value={formData.userName} onChange={handleChange} />
          <TextField name='password' label="Password" value={formData.password} onChange={handleChange} />
          <div className="modal-buttons">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default User;
