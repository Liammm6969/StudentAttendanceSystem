const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 1337;
const usersFile = "users.json";
const studentsFile = "students.json";

app.use(cors());
app.use(express.json());

function readData(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
}

function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function updateRecord(file, id, updatedRecord, idField) {
    var records = readData(file);
    var index = records.findIndex(function(record) {
        return record[idField] === id;
    });
    if (index === -1) return null;
    records[index] = updatedRecord;
    writeData(file, records);
    return updatedRecord;
}

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

// Routes
app.get("/fetchstudents", function(req, res) {
    res.json(readData(studentsFile));
});

app.post("/addstudents", function(req, res) {
    let students = readData(studentsFile);
    students.push(req.body);
    writeData(studentsFile, students);
    res.status(201).json({ message: "Student added successfully", student: req.body });
});

app.put("/updatestudent/:id", function(req, res) {
    var updated = updateRecord(studentsFile, req.params.id, req.body, "idStud");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "Student not found" });
});

app.get("/fetchusers", function(req, res) {
    res.json(readData(usersFile));
});

app.post("/addusers", function(req, res) {
    let users = readData(usersFile);
    users.push(req.body);
    writeData(usersFile, users);
    res.status(201).json(req.body);
});

app.put("/updateuser/:id", function(req, res) {
    var updated = updateRecord(usersFile, req.params.id, req.body, "userId");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "User not found" });
});

app.delete("/deleteuser/:id", function(req, res){
    let { id } = req.params;
    let User = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  
    User = User.filter((User) => User.userId !== id);
  
    fs.writeFileSync("users.json", JSON.stringify(User, null, 2));
    res.status(200).json({
      message: "User Deleted",
      User,
    });
});


app.get("/", function(req, res) {
    res.send("Hello, World!");
});

app.listen(port, function() {
    console.log("Server running on port " + port);
});