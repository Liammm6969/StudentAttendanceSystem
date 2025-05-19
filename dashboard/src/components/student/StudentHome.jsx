import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const StudentHome = () => {
  const [classes, setClasses] = useState([]);
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, attendanceResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/classes', { withCredentials: true }),
          axios.get('http://localhost:3001/api/attendance/history', { withCredentials: true })
        ]);

        setClasses(classesResponse.data);
        setRecentAttendance(attendanceResponse.data.slice(0, 5)); // Get last 5 attendance records
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
        {/* Enrolled Classes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Classes
              </Typography>
              {classes.length > 0 ? (
                classes.map((classItem) => (
                  <Box key={classItem._id} mb={2}>
                    <Typography variant="subtitle1">
                      {classItem.name}
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
                  You are not enrolled in any classes yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Attendance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Attendance
              </Typography>
              {recentAttendance.length > 0 ? (
                recentAttendance.map((record) => (
                  <Box key={record._id} mb={2}>
                    <Typography variant="subtitle1">
                      {record.class.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color={
                        record.status === 'confirmed'
                          ? 'success.main'
                          : record.status === 'rejected'
                          ? 'error.main'
                          : 'warning.main'
                      }
                    >
                      Status: {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary">
                  No attendance records found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default StudentHome; 