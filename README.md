# Student Management Application

**Repository name:** `student-management-vino`

## Student Information
Name: VINO, RODRIGO JR. D>
Course/Section: BSIT-NETAD CCIS7E

## Project Description
This project is a simple Student Management Application
created using HTML, CSS, JavaScript, Node.js, and Express.js.
The application was developed and executed using
GitHub Codespaces.

Target GitHub repository for submission:
`https://github.com/VintageW11/student-management-vino`

## Features
- View students
- Add students
- Edit students
- Delete students

## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- GitHub
- GitHub Codespaces

## How to Run
```bash
npm install
node server.js
```
Open the app on port 3000 (Codespaces: PORTS tab → Open in Browser).

## Cloud Networking
The application runs inside GitHub Codespaces.
The Node.js server listens on port 3000.
GitHub Codespaces forwards the application port so
that the web application can be accessed through
a browser.

## Cloud Security
Basic cloud security practices used in this activity include:
- No real student information was used.
- No passwords were stored in the source code.
- No API keys or credentials were committed.
- Port visibility was reviewed before sharing the application.

## Shared Responsibility Model
GitHub manages the underlying cloud infrastructure
used by GitHub Codespaces.
As the application developer, I am responsible for
the application code, repository access, credentials,
port configuration, and information stored or processed
by the application.

## Reflection Questions

### 1. What is the role of GitHub Codespaces in this activity?
GitHub Codespaces provides a cloud-based development environment, similar to Visual Studio Code, where I can create, run, and test the Student Management Application without setting up Node.js on my own computer.

### 2. What is the purpose of port 3000?
Port 3000 is the network endpoint used by the Node.js and Express server. The browser connects to this port (through Codespaces port forwarding) to load the web application and call the student API.

### 3. What may happen when the application port is made public?
When the port is public, people outside the Codespace who have the forwarded URL may be able to access the application over the Internet. That can expose the app and its data, so ports should stay private unless public access is required.

### 4. Which parts of the environment are handled by GitHub or the cloud provider?
GitHub or the cloud provider handles the physical servers, data centers, underlying infrastructure, Codespaces platform, and physical networking.

### 5. Which parts are your responsibility as the application developer?
I am responsible for the application code, repository access, data entered into the app, port visibility, credentials, application configuration, and avoiding exposed secrets.

### 6. Why should passwords, API keys, and other secrets not be uploaded to a public GitHub repository?
Anyone can view or copy a public repository. If passwords, API keys, or other secrets are uploaded, they can be stolen and misused, which can lead to unauthorized access and security incidents.

### 7. How does this activity demonstrate the Shared Responsibility Model?
GitHub provides and secures the Codespaces cloud environment, while I remain responsible for writing the application safely, using only sample student data, protecting my account, checking port visibility, and never committing secrets. Both sides share responsibility for keeping the cloud application secure.
