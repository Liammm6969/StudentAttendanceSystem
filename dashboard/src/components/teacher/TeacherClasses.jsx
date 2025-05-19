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
  IconButton,
  Chip,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Add as AddIcon, ContentCopy as ContentCopyIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../config/axios';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    schedule: [{ day: '', startTime: '', endTime: '' }]
  });

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const fetchClasses = async () => {
    try {
      const response = await api.get('/api/classes');
      setClasses(response.data);
      setError('');
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

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', startTime: '', endTime: '' }]
    });
  };

  const handleRemoveSchedule = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      schedule: newSchedule.length > 0 ? newSchedule : [{ day: '', startTime: '', endTime: '' }]
    });
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  const validateSchedule = (schedule) => {
    if (!schedule.day) return false;
    if (!schedule.startTime) return false;
    if (!schedule.endTime) return false;
    
    // Validate time format and logic
    const start = new Date(`1970-01-01T${schedule.startTime}`);
    const end = new Date(`1970-01-01T${schedule.endTime}`);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    if (end <= start) return false;
    
    return true;
  };

  const handleEditClick = (classItem) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      isActive: classItem.isActive,
      schedule: classItem.schedule
    });
    setOpenDialog(true);
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class? This will remove all enrollments and attendance records.')) {
      return;
    }

    try {
      await api.delete(`/api/classes/${classId}`);
      setSuccess('Class deleted successfully');
      fetchClasses();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete class');
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form data
      if (!formData.name.trim()) {
        setError('Class name is required');
        return;
      }

      // Validate schedule
      if (formData.schedule.length === 0) {
        setError('At least one schedule entry is required');
        return;
      }

      const invalidSchedules = formData.schedule.filter(s => !validateSchedule(s));
      if (invalidSchedules.length > 0) {
        setError('All schedule entries must have valid day and time values. End time must be after start time.');
        return;
      }

      let response;
      if (editingClass) {
        response = await api.put(`/api/classes/${editingClass._id}`, formData);
        setSuccess('Class updated successfully!');
      } else {
        response = await api.post('/api/classes', formData);
        setSuccess('Class created successfully!');
      }

      setClasses(classes.map(c => c._id === response.data._id ? response.data : c));
      setError('');
      setOpenDialog(false);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        isActive: true,
        schedule: [{ day: '', startTime: '', endTime: '' }]
      });
      setEditingClass(null);
      
      // Refresh classes
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      setError(error.response?.data?.message || 'Failed to save class');
    }
  };

  const handleClose = () => {
    setOpenDialog(false);
    setError('');
    setEditingClass(null);
    setFormData({
      name: '',
      description: '',
      isActive: true,
      schedule: [{ day: '', startTime: '', endTime: '' }]
    });
  };

  const copyClassCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('Class code copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Classes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingClass(null);
            setOpenDialog(true);
          }}
        >
          Create Class
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
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Typography variant="h6" gutterBottom>
                    {classItem.name}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditClick(classItem)}
                      title="Edit class"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteClass(classItem._id)}
                      title="Delete class"
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {classItem.description && (
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {classItem.description}
                  </Typography>
                )}

                <Box display="flex" alignItems="center" mb={2}>
                  <Typography variant="body2" color="textSecondary" mr={1}>
                    Class Code:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {classItem.code}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => copyClassCode(classItem.code)}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
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

                <Typography variant="subtitle2" gutterBottom>
                  Enrolled Students:
                </Typography>
                {classItem.enrolledStudents && classItem.enrolledStudents.length > 0 ? (
                  <Box>
                    {classItem.enrolledStudents.map((student) => (
                      <Box key={student._id} mb={1} pl={1} borderLeft={2} borderColor="primary.main">
                        <Typography variant="body2">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {student.userId}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No students enrolled yet
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">{editingClass ? 'Edit Class' : 'Create New Class'}</Typography>
          {!editingClass && (
            <Typography variant="caption" color="textSecondary">
              A unique class code will be generated automatically when the class is created
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Class Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
            error={error && !formData.name.trim()}
            helperText={error && !formData.name.trim() ? 'Class name is required' : ''}
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={2}
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                color="primary"
              />
            }
            label="Active Class"
            sx={{ mt: 1, mb: 1 }}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Schedule
          </Typography>
          
          {formData.schedule.map((schedule, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    fullWidth
                    label="Day"
                    value={schedule.day}
                    onChange={(e) =>
                      handleScheduleChange(index, 'day', e.target.value)
                    }
                    required
                    error={error && !schedule.day}
                  >
                    {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) =>
                      handleScheduleChange(index, 'startTime', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    required
                    error={error && !schedule.startTime}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) =>
                      handleScheduleChange(index, 'endTime', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    required
                    error={error && !schedule.endTime}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveSchedule(index)}
                    disabled={formData.schedule.length === 1}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
          
          <Button
            variant="outlined"
            onClick={handleAddSchedule}
            startIcon={<AddIcon />}
            sx={{ mt: 1 }}
          >
            Add Schedule
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingClass ? 'Update Class' : 'Create Class'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherClasses; 