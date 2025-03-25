import React, { useState, useEffect } from 'react';
import './AddStudent.css';
import Sidebar from './Sidebar.jsx';
import TextField from '@mui/material/TextField';
import { Button, Modal, Box, IconButton } from '@mui/material/';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

function AddStudent() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [formData, setFormData] = useState({
    idStud: '',
    firstName: '',
    lastName: '',
    middleName: '',
    course: '',
    year: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const { data } = await axios.get("http://localhost:1337/fetchstudents");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleAddStudent() {
    try {
      await axios.post("http://localhost:1337/addstudents", formData);
      console.log("Added Student:", formData);
      fetchStudents();
      setOpenAdd(false);
      setFormData({ idStud: '', firstName: '', lastName: '', middleName: '', course: '', year: '' });
    } catch (error) {
      console.error("Error adding student:", error);
    }
  }

  async function handleSaveChanges() {
    if (!editingStudent) return;
    try {
      await axios.put(`http://localhost:1337/updatestudent/${editingStudent.idStud}`, formData);
      fetchStudents();
      setOpenEdit(false);
      setEditingStudent(null);
      console.log(formData)
    } catch (error) {
      console.error("Error updating student:", error);
    }
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setFormData(student);
    setOpenEdit(true);
  }

 
  function handleOpenAddModal() {
    setEditingStudent(null);
    setFormData({
      idStud: '',
      firstName: '',
      lastName: '',
      middleName: '',
      course: '',
      year: ''
    });
    setOpenAdd(true);
  }

  return (
    <>
      <Sidebar />
      <div className='container'>
        <div className='studentInfo'>
          <h2>Student Information</h2>
          <IconButton className='addButt' onClick={handleOpenAddModal}>
            <PersonAddAlt1Icon />
          </IconButton>
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Middle Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{student.idStud}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.middleName}</td>
                  <td>{student.course}</td>
                  <td>{student.year}</td>
                  <td className="table-actions">
                    <Button onClick={() => handleEdit(student)}>
                      <EditIcon fontSize="small" />
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
          <h2>Add Student</h2>
          <TextField name='idStud' label="ID No" value={formData.idStud} onChange={handleChange} />
          <TextField name='firstName' label="First Name" value={formData.firstName} onChange={handleChange} />
          <TextField name='lastName' label="Last Name" value={formData.lastName} onChange={handleChange} />
          <TextField name='middleName' label="Middle Name" value={formData.middleName} onChange={handleChange} />
          <TextField name='course' label="Course" value={formData.course} onChange={handleChange} />
          <TextField name='year' label="Year" value={formData.year} onChange={handleChange} />
          <div className="modal-buttons">
            <Button onClick={handleAddStudent}>Add Student</Button>
            <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>

      
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <Box className='modal-box'>
          <h2>Edit Student</h2>
          <TextField name='idStud' label="ID No" value={formData.idStud} onChange={handleChange} disabled />
          <TextField name='firstName' label="First Name" value={formData.firstName} onChange={handleChange} />
          <TextField name='lastName' label="Last Name" value={formData.lastName} onChange={handleChange} />
          <TextField name='middleName' label="Middle Name" value={formData.middleName} onChange={handleChange} />
          <TextField name='course' label="Course" value={formData.course} onChange={handleChange} />
          <TextField name='year' label="Year" value={formData.year} onChange={handleChange} />
          <div className="modal-buttons">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AddStudent;