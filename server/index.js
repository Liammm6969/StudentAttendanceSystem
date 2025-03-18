const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 1337;
const usersFile = "users.json";
const studentsFile = "students.json";

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
function readData(file) {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file));
}

function writeData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function addRecord(file, newRecord) {
    var records = readData(file);
    records.push(newRecord);
    writeData(file, records);
    return newRecord;
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

// Routes
app.get("/fetchstudents", function(req, res) {
    res.json(readData(studentsFile));
});

app.post("/addstudents", function(req, res) {
    res.status(201).json(addRecord(studentsFile, req.body));
});

app.put("/updatestudent/:id", function(req, res) {
    var updated = updateRecord(studentsFile, req.params.id, req.body, "idNo");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "Student not found" });
});

app.get("/fetchusers", function(req, res) {
    res.json(readData(usersFile));
});

app.post("/addusers", function(req, res) {
    res.status(201).json(addRecord(usersFile, req.body));
});

app.put("/updateuser/:id", function(req, res) {
    var updated = updateRecord(usersFile, req.params.id, req.body, "userId");
    if (updated) res.json(updated);
    else res.status(404).json({ message: "User not found" });
});

app.get("/", function(req, res) {
    res.send("Hello, World!");
});

app.listen(port, function() {
    console.log("Server running on port " + port);
});
