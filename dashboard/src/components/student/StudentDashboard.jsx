import { Routes, Route } from 'react-router-dom';
import StudentHome from './StudentHome';
import StudentClasses from './StudentClasses';
import StudentAttendance from './StudentAttendance';

const StudentDashboard = () => {
  return (
    <Routes>
      <Route index element={<StudentHome />} />
      <Route path="classes" element={<StudentClasses />} />
      <Route path="attendance" element={<StudentAttendance />} />
    </Routes>
  );
};

export default StudentDashboard; 