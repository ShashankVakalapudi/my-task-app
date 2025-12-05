# 📌 Full Stack Task Manager App (MERN - Localhost)

A professional, secure, and modern **Task Management Application** built using the **MERN Stack** (MongoDB, Express.js, React, Node.js).

This project is configured to run **entirely on localhost** — both the backend API and frontend UI.

---

## 📖 Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Prerequisites
5. Getting Started (Step-by-Step – Localhost using ZIP)
   - Step 1: Download & Extract
   - Step 2: Backend Setup
   - Step 3: Frontend Setup
   - Step 4: Run the App
6. Project Structure
7. Useful Scripts
8. Troubleshooting
9. Author

---

## 1️⃣ Overview

This Task Manager App allows users to:

- Create an account and log in securely
- Create, view, update, and delete personal tasks
- Use a clean and responsive UI
- Manage their account and delete it along with all associated data

The app uses **JWT-based authentication**, **HTTP-only cookies**, and connects to **MongoDB** (local or cloud).

---

## 2️⃣ Features

- 🔐 **User Authentication**
  - Register and Login using **JWT (JSON Web Tokens)**
  - **HTTP-only cookies** for secure token storage

- 🛡️ **Security**
  - Passwords hashed using **bcryptjs**
  - Input validation using **express-validator**
  - Basic security practices applied at API level

- 📝 **Task Management**
  - Full **CRUD** operations:
    - Create a new task
    - View all your tasks
    - Update an existing task
    - Delete a task
  - Each user has **private tasks** (data isolation)

- 🔒 **Data Isolation**
  - Users can access **only their own** tasks
  - No cross-user access

- 📱 **Responsive UI**
  - Built with **Tailwind CSS**
  - Optimized for **Mobile, Tablet, and Desktop**

- ⚡ **Smooth UX**
  - Real-time UI updates using **React Hooks**
  - Clean and modern experience

- 🗑️ **Account Control**
  - Users can **delete their account**
  - All related tasks are removed

---

## 3️⃣ Tech Stack

| Component  | Technology         | Description                                   |
|-----------|--------------------|-----------------------------------------------|
| Frontend  | React (Vite)       | Fast UI framework with modern tooling         |
| Styling   | Tailwind CSS       | Utility-first CSS framework                   |
| Backend   | Node.js + Express  | RESTful API and server-side logic             |
| Database  | MongoDB / MongoDB Atlas | NoSQL document database                 |
| ODM       | Mongoose           | Object modeling for MongoDB                   |
| Auth      | JWT + Bcrypt       | Stateless authentication & password hashing   |

> 🔎 Note: You can use **local MongoDB** (`mongodb://localhost:27017`) or **MongoDB Atlas**.  
> The app itself runs on **localhost**.

---

## 4️⃣ Prerequisites

Before running the app, make sure the following are installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed locally  
  **OR** a MongoDB Atlas database (cloud)

---

## 5️⃣ Getting Started (Localhost – ZIP Download)

This section gives you a **step-by-step guide** to run the project **locally** after downloading the ZIP file from GitHub.

---

### 🧩 Step 1: Download & Extract Project

1. Go to the GitHub repository in your browser.
2. Click the **Code** button.
3. Choose **Download ZIP**.
4. After the download completes, **extract** the ZIP file.
5. Open a **terminal / command prompt** inside the extracted folder.  
   Example folder name:
   ```bash
   my-task-app/
