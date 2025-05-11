import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
function Sidebar() {
  return (
    <div className="sidebar">
        <div className="title">
          <h2>Student Information System</h2>
        </div>
      <div className="menu">
        <HomeIcon className="icon" />
        <Link to="/home" className="link">
          <p>HOME</p>
        </Link>
      </div>

      <div className="menu">
        <InfoIcon className="icon" />
        <Link to="/Students" className="link">
          <p>ADD STUDENT</p>
        </Link>
      </div>

      <div className="menu">
        <AccountCircleIcon className="icon" />
        <Link to="/User" className="link">
          <p>USER</p>
        </Link>
      </div>

      <div className="menu">
        <LogoutIcon className="icon" />
        <Link to="/" className="link">
          <p>Logout</p>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
