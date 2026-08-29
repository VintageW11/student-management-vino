# Student Management Application

A simple **Student Management** web app for the Cloud Application Deployment activity using Node.js, Express.js, HTML, CSS, and JavaScript.

You can **view**, **add**, **edit**, and **delete** sample student records. Records are stored **in memory only** (no database). They reset when the server restarts.

> Use sample student information only. Do not store real confidential student records, passwords, API keys, or other secrets.

## Features

- View all students in a searchable table
- Add a new student
- Edit an existing student
- Delete a student (with confirmation)
- In-memory sample data that disappears on restart

## Requirements

- Node.js 18+ (Codespaces and most modern environments include this)
- npm

## Run locally

```bash
npm install
npm start
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

The app binds to `0.0.0.0` on port **3847** so it works in local browsers and cloud preview URLs (including GitHub Codespaces port forwarding).

Optional: set a different port with an environment variable:

```bash
PORT=3000 npm start
```

## Run in GitHub Codespaces

1. Push this project to a public GitHub repository named like `student-management-lastname`.
2. In the repository, click **Code → Codespaces → Create codespace on main**.
3. In the Codespace terminal:

```bash
npm install
npm start
```

4. When the server starts, Codespaces will offer to open the forwarded port (3847). Use **Open in Browser**.

### How the app is reached through a network port

1. Express listens on a **TCP port** (default `3847`).
2. Your browser sends HTTP requests to that host and port.
3. In Codespaces, GitHub **forwards** the container port to a public or private preview URL.
4. The HTML/CSS/JS front end calls the `/api/students` endpoints on the same origin.

Without an open/listening port, the browser cannot reach the Node process.

## API overview

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/students` | List all students |
| `GET` | `/api/students/:id` | Get one student |
| `POST` | `/api/students` | Create a student |
| `PUT` | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |

Example create body:

```json
{
  "studentId": "2024-1004",
  "firstName": "Jamie",
  "lastName": "Cruz",
  "course": "BSIT",
  "yearLevel": 2,
  "email": "jamie.cruz@example.edu"
}
```

## Basic cloud security practices applied here

- Sample data only — no real student PII
- No passwords, API keys, or secrets in the repo
- Input validation on create/update (required fields, year range, email format, unique student ID)
- HTML escaping in the UI to reduce XSS risk from stored text
- Keep the Codespace and repository public only when the activity requires it; avoid uploading private credentials

## Shared Responsibility Model (GitHub Codespaces example)

Cloud platforms and users share security duties.

| Area | GitHub / cloud provider | You (student / app owner) |
|------|-------------------------|---------------------------|
| Physical data centers, hosts, hypervisor | Responsible | — |
| Codespaces VM image, networking fabric, port-forward platform | Responsible | — |
| Account access (GitHub login, 2FA, who can open the Codespace) | Provides controls | You must protect your account and invite only trusted collaborators |
| Application code and dependencies | — | You write safe code, keep packages updated, avoid secrets in git |
| Data placed in the app | — | You choose sample data only; do not upload confidential records |
| What is exposed via forwarded ports | Provides private/public visibility options | You decide who can open the preview and what the app serves |

**In short:** GitHub secures the Codespaces infrastructure. You secure your account, your application, and the data you put into it.

## Project structure

```text
.
├── package.json
├── server.js          # Express server + in-memory API
├── public/
│   ├── index.html     # UI
│   ├── styles.css     # Styles
│   └── app.js         # Front-end CRUD logic
└── README.md
```

## Activity submission note

After pushing to GitHub, submit your **repository link** as required by your course. Rename the repo to match `student-management-lastname` if your instructor requires that format.
