import React, { useState, useEffect } from "react";
import "./AddStudent.css";
import Sidebar from "./Sidebar.jsx";
import TextField from "@mui/material/TextField";
import {
  Button,
  Modal,
  Box,
  IconButton,
  Tooltip,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material/";
import axios from "axios";
import validator from "validator";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function AddStudent() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    course: "",
    year: "",
  });
  const [errors, setErrors] = useState({
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    course: "",
    year: "",
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
      showNotification("Failed to load students", "error");
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function showNotification(message, type) {
    setNotification({
      open: true,
      message,
      type,
    });
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    if (validator.isEmpty(formData.id)) {
      newErrors.id = "ID is required";
      isValid = false;
    } else if (!validator.isNumeric(formData.id)) {
      newErrors.id = "ID must contain only numbers";
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
    if (validator.isEmpty(formData.course)) {
      newErrors.course = "Course is required";
      isValid = false;
    } else if (!validator.isAlpha(formData.course)) {
      newErrors.course = "Course should contain only letters";
      isValid = false;
    }

    if (validator.isEmpty(formData.year)) {
      newErrors.year = "Year is required";
      isValid = false;
    } else if (!validator.isNumeric(formData.year)) {
      newErrors.year = "Year must be a number";
      isValid = false;
    } else {
      const yearNum = parseInt(formData.year);
      if (yearNum < 1 || yearNum > 5) {
        newErrors.year = "Year must be between 1 and 5";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleAddStudent() {
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    try {
      await axios.post("http://localhost:1337/addstudent", formData);
      fetchStudents();
      setOpenAdd(false);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        middleName: "",
        course: "",
        year: "",
      });
      setErrors({
        id: "",
        firstName: "",
        lastName: "",
        middleName: "",
        course: "",
        year: "",
      });
      showNotification("Student added successfully!", "success");
    } catch (error) {
      console.error("Error adding student:", error);
      
      if (error.response && error.response.status === 409) {
        showNotification("Student ID already exists", "error");
      } else {
        showNotification("Failed to add student", "error");
      }
    }
  }

  async function handleSaveChanges() {
    if (!editingStudent) return;
    
    if (!validateForm()) {
      showNotification("Please fix the form errors", "error");
      return;
    }

    try {
      await axios.put(
        `http://localhost:1337/updatestudent/${editingStudent.id}`,
        formData
      );
      fetchStudents();
      setOpenEdit(false);
      setEditingStudent(null);
      setErrors({
        id: "",
        firstName: "",
        lastName: "",
        middleName: "",
        course: "",
        year: "",
      });
      showNotification("Student updated successfully!", "success");
    } catch (error) {
      console.error("Error updating student:", error);
      showNotification("Failed to update student", "error");
    }
  }

  async function handleDelete(studentId) {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:1337/deletestudent/${studentId}`);
        fetchStudents();
        showNotification("Student deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting student:", error);
        showNotification("Failed to delete student", "error");
      }
    }
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setFormData(student);
    setErrors({
      id: "",
      firstName: "",
      lastName: "",
      middleName: "",
      course: "",
      year: "",
    });
    setOpenEdit(true);
  }

  function handleOpenAddModal() {
    setEditingStudent(null);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      middleName: "",
      course: "",
      year: "",
    });
    setErrors({
      id: "",
      firstName: "",
      lastName: "",
      middleName: "",
      course: "",
      year: "",
    });
    setOpenAdd(true);
  }

  const filteredStudents = students.filter((student) => {
    const searchFields = [
      student.id?.toString(),
      student.firstName,
      student.lastName,
      student.middleName,
      student.course,
      student.year?.toString(),
    ];
    return searchFields.some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  let content;
  if (filteredStudents.length > 0) {
    content = (
      <div className="table-container">
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
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.middleName}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td className="table-actions">
                  <Tooltip title="Edit">
                    <IconButton
                      className="edit-button"
                      onClick={() => handleEdit(student)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      className="delete-button"
                      onClick={() => handleDelete(student.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } else {
    content = (
      <div className="empty-state">
        <h3>No students found</h3>
        <p>No students found. Try adding one!</p>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleOpenAddModal}
        >
          Add First Student
        </Button>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="container">
        <div className="studentInfo">
          <div className="header-section">
            <h2>
              <SchoolIcon className="header-icon" />
              Student Information
            </h2>

            <div className="search-bar">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <IconButton
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </div>

            <div className="table-actions-bar">
              <Tooltip title="Add Student">
                <IconButton className="addButt" onClick={handleOpenAddModal}>
                  <PersonAddAlt1Icon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {/*ung table*/}
          {content} 
          
        </div>
      </div>

      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        closeAfterTransition
      >
        <Fade in={openAdd}>
          <Box className="modal-box">
            <h2>Add New Student</h2>
            <TextField
              name="id"
              label="ID Number"
              variant="outlined"
              fullWidth
              value={formData.id}
              onChange={handleChange}
              error={!!errors.id}
              helperText={errors.id}
              margin="normal"
            />
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              margin="normal"
            />
            <TextField
              name="middleName"
              label="Middle Name"
              variant="outlined"
              fullWidth
              value={formData.middleName}
              onChange={handleChange}
              error={!!errors.middleName}
              helperText={errors.middleName}
              margin="normal"
            />
            <TextField
              name="course"
              label="Course"
              variant="outlined"
              fullWidth
              value={formData.course}
              onChange={handleChange}
              error={!!errors.course}
              helperText={errors.course}
              margin="normal"
            />
            <TextField
              name="year"
              label="Year Level"
              variant="outlined"
              fullWidth
              value={formData.year}
              onChange={handleChange}
              error={!!errors.year}
              helperText={errors.year}
              margin="normal"
            />
            <div className="modal-buttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddStudent}
              >
                Add Student
              </Button>
              <Button variant="outlined" onClick={() => setOpenAdd(false)}>
                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        closeAfterTransition
      >
        <Fade in={openEdit}>
          <Box className="modal-box">
            <h2>Edit Student</h2>
            <TextField
              name="id"
              label="ID Number"
              variant="outlined"
              fullWidth
              value={formData.id}
              onChange={handleChange}
              disabled
              margin="normal"
            />
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              fullWidth
              value={formData.firstName}
              onChange={handleChange}
              error={!!errors.firstName}
              helperText={errors.firstName}
              margin="normal"
            />
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              margin="normal"
            />
            <TextField
              name="middleName"
              label="Middle Name"
              variant="outlined"
              fullWidth
              value={formData.middleName}
              onChange={handleChange}
              error={!!errors.middleName}
              helperText={errors.middleName}
              margin="normal"
            />
            <TextField
              name="course"
              label="Course"
              variant="outlined"
              fullWidth
              value={formData.course}
              onChange={handleChange}
              error={!!errors.course}
              helperText={errors.course}
              margin="normal"
            />
            <TextField
              name="year"
              label="Year Level"
              variant="outlined"
              fullWidth
              value={formData.year}
              onChange={handleChange}
              error={!!errors.year}
              helperText={errors.year}
              margin="normal"
            />
            <div className="modal-buttons">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
              <Button variant="outlined" onClick={() => setOpenEdit(false)}>
                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notification.type}
          variant="filled"
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddStudent;