const express = require("express");
const cors = require("cors");

const app = express();
const port = 1337;
const Student = require("./models/Student.model");
const User = require("./models/User.model");

const mongoose = require("mongoose");

const validator = require("validator")

mongoose.connect("mongodb://localhost:27017/StudentData")
.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(cors());
app.use(express.json());


app.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;
   
        const user = await User.findOne({ userName, password });
        
        if (user) {
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});

app.get("/fetchstudents", async (req, res) => {

    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (e) {
        console.error("Error fetching students:", e);
        return res.status(500).json({ message: "Error fetching students" });
    }
});
app.post("/addstudent", async (req, res) => {
    try {
        const { id, firstName, lastName, middleName, course, year } = req.body;

        const newStudent = new Student({
            id, firstName, lastName, middleName, course, year
        });

         await newStudent.save();
        res.status(201).json({ message: "Student added successfully", newStudent });
    } catch (e) {
        console.error("Error adding student:", e);
        return res.status(500).json({ message: e.message});
    }
});
app.put("/updatestudent/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedStudent = await Student.findOneAndUpdate({ id }, updateData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", updatedStudent });
    } catch (e) {
        console.error("Error updating student:", e);
        return res.status(500).json({ message: "Error updating student" });
    }
});
app.delete("/deletestudent/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await Student.findOneAndDelete({ id });

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully", deletedStudent });
    } catch (e) {
        console.error("Error deleting student:", e);
        res.status(500).json({ message: "Error deleting student" });
    }
});


// USER
app.get("/fetchusers", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (e) {
        console.error("Error fetching users:", e);
        return res.status(500).json({ message: "Error fetching users" });
    }
});

app.post("/adduser", async (req, res) => {
    try {
        const { userId, firstName, lastName, middleName, userName, password } = req.body;

        const existingUser = await User.findOne({ 
            $or: [
                { userId: userId },
                { userName: userName }
            ]
        });

        if (existingUser) {
            if (existingUser.userId === userId) {
                return res.status(400).json({ message: "User ID already exists" });
            }
            if (existingUser.userName === userName) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        const newUser = new User({
            userId, firstName, lastName, middleName, userName, password
        });

        await newUser.save();
        res.status(201).json({ message: "User added successfully", newUser });
    } catch (e) {
        console.error("Error adding user:", e);
        return res.status(500).json({ message: e.message });
    }
});

app.put("/updateuser/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData.userName) {
            const existingUser = await User.findOne({ 
                userName: updateData.userName,
                userId: { $ne: id }
            });

            if (existingUser) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: id }, 
            updateData, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (e) {
        console.error("Error updating user:", e);
        return res.status(500).json({ message: "Error updating user" });
    }
});

app.delete("/deleteuser/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findOneAndDelete({ userId: id });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (e) {
        console.error("Error deleting user:", e);
        res.status(500).json({ message: "Error deleting user" });
    }
});

app.get("/", function(req, res) {
    res.send("Hello, World!");
});

app.listen(port, function() {
    console.log("Server running on port " + port);
});