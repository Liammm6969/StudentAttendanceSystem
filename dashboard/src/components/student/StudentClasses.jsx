import { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import axios from 'axios';

const StudentClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/classes', {
        withCredentials: true
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleJoinClass = async () => {
    try {
      await axios.post(
        'http://localhost:3001/api/enrollments',
        { classCode },
        { withCredentials: true }
      );
      setSuccess('Successfully joined the class!');
      setOpenDialog(false);
      setClassCode('');
      fetchClasses(); // Refresh the class list
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join class');
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
          My Classes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Join New Class
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
        {classes.map((classItem) => (
          <Grid item xs={12} md={6} key={classItem._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {classItem.name}
                </Typography>
                {classItem.description && (
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {classItem.description}
                  </Typography>
                )}
                
                <Box mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Teacher:
                  </Typography>
                  <Box pl={1} borderLeft={2} borderColor="primary.main">
                    <Typography variant="body2">
                      {classItem.teacher?.firstName} {classItem.teacher?.lastName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {classItem.teacher?.userId}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Schedule:
                </Typography>
                <Box mb={2}>
                  {classItem.schedule.map((schedule, index) => (
                    <Chip
                      key={index}
                      label={`${schedule.day} ${schedule.startTime}-${schedule.endTime}`}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Join Class Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Join a Class</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Class Code"
            fullWidth
            variant="outlined"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            helperText="Enter the class code provided by your teacher"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinClass} variant="contained" color="primary">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentClasses; 