import { useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import Homee from './pages/Dashboard.jsx'
import AddStudents from './pages/AddStudent.jsx'
import TaskTracker from './pages/TaskTracket.jsx'
function App() {
  return (
  <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homee />}></Route>
      <Route path="/students" element={<AddStudents />}></Route>
      <Route path="/tasktracker" element={<TaskTracker />}></Route>
    </Routes>
    </BrowserRouter>
  </>
  )
}

export default App