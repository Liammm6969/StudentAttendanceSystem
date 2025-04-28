const express = require("express");
const cors = require("cors");

const app = express();
const port = 1337;
const Student = require("./models/Student.model");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/StudentData")
.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

app.use(cors());
app.use(express.json());


app.post("/login", (req, res) => {
    let users = readData(usersFile);
    const { userName, password } = req.body;

    const user = users.find(user => user.userName === userName && user.password === password);
    
    if (user) {
        res.status(200).json({ message: "Login successful", user });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
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

app.get("/", function(req, res) {
    res.send("Hello, World!");
});

app.listen(port, function() {
    console.log("Server running on port " + port);
});