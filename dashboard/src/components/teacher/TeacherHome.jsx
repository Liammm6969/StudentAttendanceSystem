import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherHome = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, attendanceResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/classes', { withCredentials: true }),
          axios.get('http://localhost:3001/api/attendance/pending', { withCredentials: true })
        ]);

        setClasses(classesResponse.data);
        setPendingAttendance(attendanceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Classes Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Your Classes
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate('/teacher-dashboard/classes')}
                >
                  Manage Classes
                </Button>
              </Box>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <Box key={classItem._id} mb={2}>
                    <Typography variant="subtitle1">
                      {classItem.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Code: {classItem.code}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {classItem.schedule.map(s => 
                        `${s.day} ${s.startTime}-${s.endTime}`
                      ).join(', ')}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary">
                  You haven't created any classes yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Attendance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Pending Attendance
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate('/teacher-dashboard/attendance')}
                >
                  Review All
                </Button>
              </Box>
              {pendingAttendance.length > 0 ? (
                pendingAttendance.map((record) => (
                  <Box key={record._id} mb={2}>
                    <Typography variant="subtitle1">
                      {record.class.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Student: {record.student.firstName} {record.student.lastName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time: {new Date(record.date).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary">
                  No pending attendance records.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default TeacherHome; 