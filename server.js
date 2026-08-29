const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let students = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    course: "BSIT",
  },
  {
    id: 2,
    name: "Maria Santos",
    course: "BSCS",
  },
];

// GET ALL STUDENTS
app.get("/api/students", (req, res) => {
  res.json(students);
});

// ADD STUDENT
app.post("/api/students", (req, res) => {
  const student = {
    id: Date.now(),
    name: req.body.name,
    course: req.body.course,
  };
  students.push(student);
  res.json(student);
});

// UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  student.name = req.body.name;
  student.course = req.body.course;
  res.json(student);
});

// DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  students = students.filter((student) => student.id !== id);
  res.json({
    message: "Student deleted",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
