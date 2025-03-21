import { useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from './pages/Login.jsx'
import Homee from './pages/Dashboard.jsx'
import AddStudents from './pages/AddStudent.jsx'
import TaskTracker from './pages/TaskTracket.jsx'
import User from './pages/User.jsx'
function App() {
  return (
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/home" element={<Homee />}></Route>
      <Route path="/students" element={<AddStudents />}></Route>
      <Route path="/tasktracker" element={<TaskTracker />}></Route>
      <Route path="/user" element={<User />}></Route>
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App