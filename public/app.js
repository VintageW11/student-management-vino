const studentsBody = document.getElementById("students-body");
const studentsTable = document.getElementById("students-table");
const emptyState = document.getElementById("empty");
const errorBanner = document.getElementById("error");
const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("search");

const studentDialog = document.getElementById("student-dialog");
const studentForm = document.getElementById("student-form");
const dialogTitle = document.getElementById("dialog-title");
const formError = document.getElementById("form-error");
const recordIdInput = document.getElementById("record-id");

const confirmDialog = document.getElementById("confirm-dialog");
const confirmForm = document.getElementById("confirm-form");
const confirmMessage = document.getElementById("confirm-message");

let students = [];
let pendingDeleteId = null;

const fields = {
  studentId: document.getElementById("studentId"),
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  course: document.getElementById("course"),
  yearLevel: document.getElementById("yearLevel"),
  email: document.getElementById("email"),
};

function setStatus(message) {
  statusEl.textContent = message;
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.classList.remove("hidden");
}

function clearError() {
  errorBanner.textContent = "";
  errorBanner.classList.add("hidden");
}

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function clearFormError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: "Unexpected server response." };
    }
  }

  if (!response.ok) {
    throw new Error((payload && payload.error) || "Request failed.");
  }

  return payload;
}

function filteredStudents() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return students;

  return students.filter((student) => {
    const haystack = [
      student.studentId,
      student.firstName,
      student.lastName,
      `${student.firstName} ${student.lastName}`,
      student.course,
      student.email,
      String(student.yearLevel),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

function renderStudents() {
  const list = filteredStudents();
  studentsBody.innerHTML = "";
  clearError();

  countEl.textContent = `${list.length} shown · ${students.length} total`;

  if (students.length === 0) {
    studentsTable.classList.add("hidden");
    emptyState.classList.remove("hidden");
    setStatus("No students in memory.");
    return;
  }

  emptyState.classList.add("hidden");
  studentsTable.classList.remove("hidden");

  if (list.length === 0) {
    setStatus("No students match your search.");
    return;
  }

  setStatus("Ready.");

  for (const student of list) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(student.studentId)}</td>
      <td class="name-cell">${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${escapeHtml(String(student.yearLevel))}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>
        <div class="actions">
          <button type="button" class="btn btn-small btn-edit" data-edit="${student.id}">Edit</button>
          <button type="button" class="btn btn-small btn-delete" data-delete="${student.id}">Delete</button>
        </div>
      </td>
    `;
    studentsBody.appendChild(row);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function loadStudents() {
  setStatus("Loading students…");
  try {
    students = await api("/api/students");
    renderStudents();
  } catch (error) {
    students = [];
    renderStudents();
    showError(error.message || "Could not load students.");
    setStatus("Failed to load.");
  }
}

function openAddDialog() {
  clearFormError();
  studentForm.reset();
  recordIdInput.value = "";
  dialogTitle.textContent = "Add student";
  fields.yearLevel.value = "1";
  studentDialog.showModal();
  fields.studentId.focus();
}

function openEditDialog(id) {
  const student = students.find((item) => item.id === id);
  if (!student) return;

  clearFormError();
  recordIdInput.value = String(student.id);
  dialogTitle.textContent = "Edit student";
  fields.studentId.value = student.studentId;
  fields.firstName.value = student.firstName;
  fields.lastName.value = student.lastName;
  fields.course.value = student.course;
  fields.yearLevel.value = String(student.yearLevel);
  fields.email.value = student.email;
  studentDialog.showModal();
  fields.firstName.focus();
}

function openDeleteDialog(id) {
  const student = students.find((item) => item.id === id);
  if (!student) return;

  pendingDeleteId = id;
  confirmMessage.textContent = `Delete ${student.firstName} ${student.lastName} (${student.studentId})? This removes the sample record from memory.`;
  confirmDialog.showModal();
}

function collectFormData() {
  return {
    studentId: fields.studentId.value.trim(),
    firstName: fields.firstName.value.trim(),
    lastName: fields.lastName.value.trim(),
    course: fields.course.value.trim(),
    yearLevel: Number(fields.yearLevel.value),
    email: fields.email.value.trim(),
  };
}

document.getElementById("open-add").addEventListener("click", openAddDialog);
document.getElementById("empty-add").addEventListener("click", openAddDialog);
document.getElementById("close-dialog").addEventListener("click", () => {
  studentDialog.close();
});
document.getElementById("cancel-dialog").addEventListener("click", () => {
  studentDialog.close();
});
document.getElementById("cancel-delete").addEventListener("click", () => {
  pendingDeleteId = null;
  confirmDialog.close();
});

searchInput.addEventListener("input", renderStudents);

studentsBody.addEventListener("click", (event) => {
  const editId = event.target.getAttribute("data-edit");
  const deleteId = event.target.getAttribute("data-delete");
  if (editId) openEditDialog(Number(editId));
  if (deleteId) openDeleteDialog(Number(deleteId));
});

studentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormError();

  const payload = collectFormData();
  const editingId = recordIdInput.value;
  const saveBtn = document.getElementById("save-student");
  saveBtn.disabled = true;

  try {
    if (editingId) {
      await api(`/api/students/${editingId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setStatus("Student updated.");
    } else {
      await api("/api/students", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus("Student added.");
    }
    studentDialog.close();
    await loadStudents();
  } catch (error) {
    showFormError(error.message || "Could not save student.");
  } finally {
    saveBtn.disabled = false;
  }
});

confirmForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (pendingDeleteId == null) return;

  const deleteBtn = document.getElementById("confirm-delete");
  deleteBtn.disabled = true;

  try {
    await api(`/api/students/${pendingDeleteId}`, { method: "DELETE" });
    pendingDeleteId = null;
    confirmDialog.close();
    setStatus("Student deleted.");
    await loadStudents();
  } catch (error) {
    confirmDialog.close();
    showError(error.message || "Could not delete student.");
  } finally {
    deleteBtn.disabled = false;
  }
});

loadStudents();
