import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import api from '../../config/axios';

const StudentAttendance = () => {
  const [classes, setClasses] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  const fetchData = async () => {
    try {
      const [classesResponse, attendanceResponse] = await Promise.all([
        api.get('/api/classes'),
        api.get('/api/attendance/history')
      ]);

      setClasses(classesResponse.data);
      setAttendanceHistory(attendanceResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitAttendance = async () => {
    if (!selectedClass) {
      setError('Please select a class');
      return;
    }

    try {
      // Get current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      await api.post(
        '/api/attendance',
        {
          classId: selectedClass,
          location
        }
      );

      setSuccess('Attendance submitted successfully!');
      setOpenDialog(false);
      setSelectedClass('');
      fetchData(); // Refresh the attendance history
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit attendance');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          My Attendance
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Submit Attendance
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {attendanceHistory.map((record) => (
          <Grid item xs={12} md={6} key={record._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {record.class.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {new Date(record.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Time: {new Date(record.date).toLocaleTimeString()}
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
                  sx={{ mt: 1 }}
                >
                  Status: {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Typography>
                {record.notes && (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    Notes: {record.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Submit Attendance Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Submit Attendance</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="class-select-label">Select Class</InputLabel>
            <Select
              labelId="class-select-label"
              value={selectedClass}
              label="Select Class"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((classItem) => (
                <MenuItem key={classItem._id} value={classItem._id}>
                  {classItem.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitAttendance} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentAttendance; 