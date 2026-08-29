const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3847;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/** In-memory sample students only — not real student records. */
let nextId = 4;
let students = [
  {
    id: 1,
    studentId: "2024-1001",
    firstName: "Ana",
    lastName: "Reyes",
    course: "BSIT",
    yearLevel: 2,
    email: "ana.reyes@example.edu",
  },
  {
    id: 2,
    studentId: "2024-1002",
    firstName: "Mark",
    lastName: "Santos",
    course: "BSCS",
    yearLevel: 3,
    email: "mark.santos@example.edu",
  },
  {
    id: 3,
    studentId: "2024-1003",
    firstName: "Liza",
    lastName: "Garcia",
    course: "BSIS",
    yearLevel: 1,
    email: "liza.garcia@example.edu",
  },
];

function normalizeStudent(body) {
  const studentId = String(body.studentId || "").trim();
  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const course = String(body.course || "").trim();
  const email = String(body.email || "").trim();
  const yearLevel = Number(body.yearLevel);

  if (!studentId || !firstName || !lastName || !course || !email) {
    return { error: "All fields are required." };
  }

  if (!Number.isInteger(yearLevel) || yearLevel < 1 || yearLevel > 5) {
    return { error: "Year level must be an integer from 1 to 5." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  return {
    studentId,
    firstName,
    lastName,
    course,
    yearLevel,
    email,
  };
}

app.get("/api/students", (_req, res) => {
  res.json(students);
});

app.get("/api/students/:id", (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));
  if (!student) {
    return res.status(404).json({ error: "Student not found." });
  }
  res.json(student);
});

app.post("/api/students", (req, res) => {
  const data = normalizeStudent(req.body);
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const duplicate = students.some(
    (s) => s.studentId.toLowerCase() === data.studentId.toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({ error: "Student ID already exists." });
  }

  const student = { id: nextId++, ...data };
  students.push(student);
  res.status(201).json(student);
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found." });
  }

  const data = normalizeStudent(req.body);
  if (data.error) {
    return res.status(400).json({ error: data.error });
  }

  const duplicate = students.some(
    (s) =>
      s.id !== id &&
      s.studentId.toLowerCase() === data.studentId.toLowerCase()
  );
  if (duplicate) {
    return res.status(400).json({ error: "Student ID already exists." });
  }

  students[index] = { id, ...data };
  res.json(students[index]);
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found." });
  }

  const [removed] = students.splice(index, 1);
  res.json(removed);
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Student Management app running at http://127.0.0.1:${PORT}`);
});
