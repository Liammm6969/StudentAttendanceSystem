import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar.jsx';
import { useState } from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

function Homee() {
  const [color, setColor] = useState("fuschia");//string
  const [grade, setGrade] = useState(null);//int
  const [student, setStudent] = useState({
    idNo: "",
    firstName: "",
    lastName: "",
    middleName: "",
    course: "",
    year: "",
  });

  function handleClick(){
    setStudent({
      idNo: document.getElementById("idNo").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      middleName: document.getElementById("middleName").value,
      course: document.getElementById("course").value,
      year: document.getElementById("year").value,
    });
  }

  return (
    <>
    <div className='home'>
          <Sidebar/>
    </div>
    </>

  );
}

export default Homee;
