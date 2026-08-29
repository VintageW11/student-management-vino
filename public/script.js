const form = document.getElementById("studentForm");
const studentList =
document.getElementById("studentList");
const studentId =
document.getElementById("studentId");
const nameInput =
document.getElementById("name");
const courseInput =
document.getElementById("course");

// LOAD STUDENTS
async function loadStudents() {
const response =
await fetch("/api/students");
const students =
await response.json();

studentList.innerHTML = "";

students.forEach(student => {
const row =
document.createElement("tr");

const nameCell =
document.createElement("td");
const courseCell =
document.createElement("td");
const actionCell =
document.createElement("td");

nameCell.textContent =
student.name;
courseCell.textContent =
student.course;

const editButton =
document.createElement("button");
editButton.textContent =
"Edit";
editButton.className =
"action-button";
editButton.addEventListener(
"click",
() => {
editStudent(student);
}
);

const deleteButton =
document.createElement("button");
deleteButton.textContent =
"Delete";
deleteButton.className =
"action-button";
deleteButton.addEventListener(
"click",
() => {
deleteStudent(student.id);
}
);

actionCell.appendChild(
editButton
);
actionCell.appendChild(
deleteButton
);

row.appendChild(
nameCell
);
row.appendChild(
courseCell
);
row.appendChild(
actionCell
);

studentList.appendChild(
row
);
});
}

// ADD OR UPDATE STUDENT
form.addEventListener(
"submit",
async (event) => {
event.preventDefault();

const id =
studentId.value;
const student = {
name:
nameInput.value,
course:
courseInput.value
};

if (id) {
await fetch(
`/api/students/${id}`,
{
method: "PUT",
headers: {
"Content-Type":
"application/json"
},
body:
JSON.stringify(student)
}
);
} else {
await fetch(
"/api/students",
{
method: "POST",
headers: {
"Content-Type":
"application/json"
},
body:
JSON.stringify(student)
}
);
}

form.reset();
studentId.value = "";
loadStudents();
}
);

// EDIT STUDENT
function editStudent(student) {
studentId.value =
student.id;
nameInput.value =
student.name;
courseInput.value =
student.course;
}

// DELETE STUDENT
async function deleteStudent(id) {
const confirmDelete =
confirm(
"Are you sure you want to delete this student?"
);

if (!confirmDelete) {
return;
}

await fetch(
`/api/students/${id}`,
{
method: "DELETE"
}
);

loadStudents();
}

// LOAD STUDENTS WHEN PAGE OPENS
loadStudents();
