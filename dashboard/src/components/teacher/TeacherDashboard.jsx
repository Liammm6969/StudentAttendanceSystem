import { Routes, Route } from 'react-router-dom';
import TeacherHome from './TeacherHome';
import TeacherClasses from './TeacherClasses';
import TeacherAttendance from './TeacherAttendance';

const TeacherDashboard = () => {
  return (
    <Routes>
      <Route index element={<TeacherHome />} />
      <Route path="classes" element={<TeacherClasses />} />
      <Route path="attendance" element={<TeacherAttendance />} />
    </Routes>
  );
};

export default TeacherDashboard; 