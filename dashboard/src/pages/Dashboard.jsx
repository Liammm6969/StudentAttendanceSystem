import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar.jsx';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

function Homee() {
  return (
    <>
      <div className='home'>
        <Sidebar />
        <div className="home-content">
          <h1>Welcome to the Student Information System</h1>
          <p>Manage your data and settings here. Select an option from the sidebar to get started.</p>
        </div>
      </div>
    </>
  );
}

export default Homee;
