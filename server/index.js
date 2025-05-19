const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import models
const User = require('./models/User');
const Class = require('./models/Class');
const Enrollment = require('./models/Enrollment');
const Attendance = require('./models/Attendance');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'user-id', 'Authorization'],
  credentials: true
}));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/attendance-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if cannot connect to database
});

// Simple auth middleware
const isAuthenticated = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Role-based access control middleware
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { userId, firstName, lastName, middleName, userName, password, role } = req.body;
    
    // Validate required fields
    if (!userId || !firstName || !lastName || !userName || !password) {
      console.log('Missing required fields:', { userId, firstName, lastName, userName, password });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check for existing user first
        const existingUser = await User.findOne({ 
            $or: [
                { userId: userId },
                { userName: userName }
            ]
        });

        if (existingUser) {
      console.log('Existing user found:', {
        existingUserId: existingUser.userId,
        existingUserName: existingUser.userName
      });
      return res.status(400).json({
        message: 'Username or User ID already exists',
        field: existingUser.userId === userId ? 'userId' : 'userName'
      });
    }

    const user = new User({
      userId,
      firstName,
      lastName,
      middleName,
      userName,
      password,
      role: role || 'student' // Default to student if role is not specified
    });

    console.log('Attempting to save user:', user);
    await user.save();
    console.log('User saved successfully');
    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.userName,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId
      }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error details:', error.keyPattern, error.keyValue);
      res.status(400).json({ 
        message: 'Username or User ID already exists',
        details: error.keyValue
      });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ userName: username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Send back all necessary user information
    res.json({
      user: {
        id: user._id,
        username: user.userName,
        role: user.role || 'student', // Default to student if role is not set
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
app.get('/api/auth/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Class routes
app.post('/api/classes', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const { name, description, schedule } = req.body;
    
    // Generate a random class code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Keep generating codes until we find a unique one
    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const existingClass = await Class.findOne({ code });
      if (!existingClass) {
        isUnique = true;
      }
    }

    const newClass = new Class({
      name,
      description,
      teacher: req.user._id,
      schedule,
      code
    });

    console.log('Creating new class:', newClass);
    await newClass.save();
    console.log('Class created successfully');
    
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ 
      message: 'Failed to create class',
      error: error.message 
    });
  }
});

app.get('/api/classes', isAuthenticated, async (req, res) => {
  try {
    let classes;
    if (req.user.role === 'teacher') {
      // Get teacher's classes
      classes = await Class.find({ teacher: req.user._id });
      
      // Get enrollments for each class
      const classesWithStudents = await Promise.all(classes.map(async (classItem) => {
        const enrollments = await Enrollment.find({ 
          class: classItem._id,
          status: 'active'
        }).populate('student', 'firstName lastName userId userName');
        
        const classObj = classItem.toObject();
        classObj.enrolledStudents = enrollments.map(e => e.student);
        return classObj;
      }));
      
      res.json(classesWithStudents);
    } else {
      // For students, get their enrolled classes with teacher information
      const enrollments = await Enrollment.find({ student: req.user._id, status: 'active' });
      const classIds = enrollments.map(e => e.class);
      classes = await Class.find({ _id: { $in: classIds } })
        .populate('teacher', 'firstName lastName userId userName');
      res.json(classes);
    }
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add endpoints for updating and deleting classes
app.put('/api/classes/:id', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const { name, description, schedule } = req.body;
    const classDoc = await Class.findById(req.params.id);
    
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Verify the teacher owns the class
    if (!classDoc.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to edit this class' });
    }

    classDoc.name = name;
    classDoc.description = description;
    classDoc.schedule = schedule;
    
    await classDoc.save();
    res.json(classDoc);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/classes/:id', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id);
    
    if (!classDoc) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    // Verify the teacher owns the class
    if (!classDoc.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this class' });
    }

    // Delete all enrollments for this class
    await Enrollment.deleteMany({ class: classDoc._id });
    
    // Delete all attendance records for this class
    await Attendance.deleteMany({ class: classDoc._id });
    
    // Delete the class
    await classDoc.delete();
    
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enrollment routes
app.post('/api/enrollments', isAuthenticated, hasRole(['student']), async (req, res) => {
  try {
    const { classCode } = req.body;
    const classToJoin = await Class.findOne({ code: classCode });
    
    if (!classToJoin) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const enrollment = new Enrollment({
      student: req.user._id,
      class: classToJoin._id
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Already enrolled in this class' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

// Attendance routes
app.post('/api/attendance', isAuthenticated, hasRole(['student']), async (req, res) => {
  try {
    const { classId, location } = req.body;
    
    // Check if student is enrolled in the class
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      class: classId,
      status: 'active'
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Not enrolled in this class' });
    }

    const attendance = new Attendance({
      student: req.user._id,
      class: classId,
      date: new Date(),
      location
    });

    await attendance.save();
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/attendance/:id', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    // Verify the teacher owns the class
    const classDoc = await Class.findById(attendance.class);
    if (!classDoc.teacher.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to review this attendance' });
    }

    attendance.status = status;
    attendance.notes = notes;
    attendance.reviewedBy = req.user._id;
    attendance.reviewTime = new Date();

    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending attendance records for teacher's classes
app.get('/api/attendance/pending', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id });
    const classIds = classes.map(c => c._id);
    
    const pendingAttendance = await Attendance.find({
      class: { $in: classIds },
      status: 'pending'
    })
    .populate('student', 'username firstName lastName')
    .populate('class', 'name');

    res.json(pendingAttendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's attendance history
app.get('/api/attendance/history', isAuthenticated, hasRole(['student']), async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id })
      .populate('class', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all attendance records for teacher's classes
app.get('/api/attendance/teacher-history', isAuthenticated, hasRole(['teacher']), async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user._id });
    const classIds = classes.map(c => c._id);
    
    const attendance = await Attendance.find({
      class: { $in: classIds }
    })
    .populate('student', 'firstName lastName userId userName')
    .populate('class', 'name')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});