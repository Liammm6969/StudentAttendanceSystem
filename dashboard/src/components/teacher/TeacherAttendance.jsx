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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import api from '../../config/axios';

const TeacherAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    notes: ''
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchAttendanceRecords = async () => {
    try {
      const response = await api.get('/api/attendance/teacher-history');
      setAttendanceRecords(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const handleReviewClick = (record) => {
    setSelectedRecord(record);
    setReviewData({
      status: record.status || '',
      notes: record.notes || ''
    });
    setOpenDialog(true);
  };

  const handleReviewSubmit = async () => {
    try {
      await api.put(
        `/api/attendance/${selectedRecord._id}`,
        reviewData
      );
      setSuccess('Attendance review submitted successfully!');
      setOpenDialog(false);
      fetchAttendanceRecords();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    if (statusFilter === 'all') return true;
    return record.status === statusFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
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
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Attendance Records
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Records</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
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
        {filteredRecords.map((record) => (
          <Grid item xs={12} md={6} key={record._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {record.class.name}
                    </Typography>
                    <Typography variant="body1">
                      {record.student.firstName} {record.student.lastName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Student ID: {record.student.userId}
                    </Typography>
                  </Box>
                  <Chip
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    color={getStatusColor(record.status)}
                    size="small"
                  />
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Submitted: {format(new Date(record.date), 'PPp')}
                  </Typography>
                  
                  {record.reviewedBy && (
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Reviewed by: {record.reviewedBy.firstName} {record.reviewedBy.lastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Review time: {format(new Date(record.reviewTime), 'PPp')}
                      </Typography>
                    </>
                  )}

                  {record.notes && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Notes: {record.notes}
                    </Typography>
                  )}

                  {record.location && (
                    <Typography variant="body2" color="textSecondary">
                      Location: {record.location.latitude}, {record.location.longitude}
                    </Typography>
                  )}
                </Box>

                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReviewClick(record)}
                    size="small"
                  >
                    {record.status === 'pending' ? 'Review' : 'Update Review'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filteredRecords.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">
              No attendance records found for the selected filter.
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Review Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Review Attendance</DialogTitle>
        <DialogContent>
          {selectedRecord && (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Class: {selectedRecord.class.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Student: {selectedRecord.student.firstName} {selectedRecord.student.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Submitted: {format(new Date(selectedRecord.date), 'PPp')}
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={reviewData.status}
                  label="Status"
                  onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                >
                  <MenuItem value="confirmed">Confirm</MenuItem>
                  <MenuItem value="rejected">Reject</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={reviewData.notes}
                onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            color="primary"
            disabled={!reviewData.status}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TeacherAttendance; 