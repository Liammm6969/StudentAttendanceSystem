const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let students = [];

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/fetchstudents", (req, res) => {
    res.json(students);
});

app.post("/addstudents", (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    res.status(201).json(newStudent);
});

app.put("/updatestudent/:idStud", (req, res) => {
    const { idStud } = req.params;
    const updatedStudent = req.body;

    const index = students.findIndex(student => student.idStud === idStud);
    if (index !== -1) {
        students[index] = updatedStudent;
        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: "Student not found" });
    }
});

const port = 1337;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
