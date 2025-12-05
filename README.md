# 📋 Professional Task Manager App (MERN Stack)

A **secure, full-stack Task Management application** built with the **MERN stack (MongoDB, Express.js, React, Node.js)**.

This application features:

- 🔐 Secure user authentication (JWT + bcrypt)
- 🧍‍♂️🧍‍♀️ Per-user data isolation
- 📱 Responsive, modern UI (React + Tailwind)
- ✅ Complete Task CRUD (Create, Read, Update, Delete)

> ⚠️ Note: This project currently runs on **localhost** (local development environment).

---

## 🧭 Table of Contents

1. [Technologies Used](#-technologies-used)
2. [Prerequisites](#%EF%B8%8F-prerequisites)
3. [Environment Setup](#%EF%B8%8F-environment-setup)
   - [Backend `.env`](#1-backend-env)
   - [Frontend `client/.env`](#2-frontend-clientenv)
4. [Installation & Setup](#-installation--setup-guide)
   - [Option A: Clone from GitHub](#option-a-cloning-from-github)
   - [Option B: Download ZIP](#option-b-downloading-zip)
5. [Running the Application](#%EF%B8%8F-how-to-run-the-app)
   - [Step 1: Start Backend](#step-1-start-the-backend-server)
   - [Step 2: Start Frontend](#step-2-start-the-frontend-server)
6. [How the App Works](#-how-the-app-works)
   - [User Authentication](#user-authentication)
   - [Task Management (CRUD)](#task-management-crud)
   - [Data Isolation](#data-isolation)
   - [Account Management](#account-management)
7. [Project Structure (Overview)](#-project-structure-overview)
8. [Future Improvements (Optional Ideas)](#-future-improvements-optional-ideas)

---

## 🚀 Technologies Used

This project utilizes a **modern and robust tech stack**:

### 🖥️ Frontend

- **React (Vite)** – Fast, modern frontend library with Vite as the build tool.
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development.
- **Lucide React** – Beautiful and consistent icon set.
- **PostCSS & Autoprefixer** – For processing and optimizing CSS.

### 🛠️ Backend

- **Node.js & Express.js** – Server-side runtime and web framework.
- **MongoDB & Mongoose** – NoSQL database and Object Data Modeling (ODM).

### 🔐 Authentication & Security

- **JSON Web Token (JWT)** – Secure, stateless authentication.
- **bcryptjs** – Secure password hashing.

### ✅ Validation & Utilities

- **express-validator** – Middleware for input validation.
- **CORS** – Handles Cross-Origin Resource Sharing between frontend & backend.
- **dotenv** – Environment variable management.

---

## 🛠️ Prerequisites

Before running this application, make sure you have:

- **Node.js** (v16 or higher)  
- **npm** (Node Package Manager)  
- **MongoDB**:
  - Either a **MongoDB Atlas** cloud account  
  - Or a **local MongoDB instance**

---

## ⚙️ Environment Setup

You need to configure **environment variables** for both the **backend** and **frontend** so the app connects securely to the database and API.

### 1. Backend `.env`

Create a file named `.env` in the **root folder** of the project:

`my-task-app/.env`

Add the following:

```env
# Port for the backend server (default is 5000)
PORT=5000

# Your MongoDB Connection String (from MongoDB Atlas or Local)
# Example: mongodb+srv://<username>:<password>@cluster.mongodb.net/my-database
MONGODB_URI=your_mongodb_connection_string_here

# A strong, secret key for signing JWT tokens
JWT_SECRET=your_super_secret_random_string
