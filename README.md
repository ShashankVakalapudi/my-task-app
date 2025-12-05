# 📋 Professional Task Manager App (MERN Stack)

A **secure, full-stack Task Management application** built with the **MERN stack (MongoDB, Express.js, React, Node.js)**. This application is designed for multi-user support, ensuring data isolation and secure authentication.

---

## 🧭 Table of Contents

1. [Technologies Used](#-technologies-used)  
2. [Prerequisites](#%EF%B8%8F-prerequisites)  
3. [Environment Setup](#%EF%B8%8F-environment-setup)  
   - [Backend .env](#backend-env)  
   - [Frontend client/.env](#frontend-clientenv)  
4. [Installation & Setup](#-installation--setup-guide)  
5. [Running the Application](#%EF%B8%8F-how-to-run-the-app)  
6. [How the App Works](#-how-the-app-works)  
   - [User Authentication](#user-authentication)  
   - [Task Management (CRUD)](#task-management-crud)  
   - [Data Isolation](#data-isolation)  
   - [Account Management](#account-management)  
7. [Project Structure](#-project-structure-overview)  
8. [Future Improvements](#-future-improvements-optional-ideas)  

---

## 🚀 Technologies Used

This project utilizes a modern and robust tech stack:

### 🖥️ Frontend

- **React (Vite)**: Fast, modern frontend framework.  
- **Tailwind CSS**: Utility-first CSS framework for styling.  
- **Lucide React**: Lightweight and beautiful icon set.  
- **PostCSS & Autoprefixer**: CSS transformations.  

### 🛠️ Backend

- **Node.js & Express.js**: Server-side runtime and REST API framework.  
- **MongoDB & Mongoose**: NoSQL database and Object Data Modeling (ODM).  

### 🔐 Security & Validation

- **JWT (JSON Web Tokens)**: Stateless user authentication.  
- **bcryptjs**: Secure password hashing.  
- **express-validator**: Middleware for sanitizing and validating inputs.  
- **CORS**: Cross-Origin Resource Sharing configuration.  

---

## 🛠️ Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)  
- **npm** (Node Package Manager)  
- **MongoDB Atlas Account** (or a local MongoDB instance)  

---

## ⚙️ Environment Setup

You must create environment configuration files to secure your keys and database connections.

### Backend .env

Create a file named `.env` in the **root** folder (`my-task-app/.env`) and add:

env

```env
# Server Port (Default 5000)
PORT=5000

# MongoDB Connection String (Get this from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/my-database

# Secret Key for JWT Signing (Make this complex!)
JWT_SECRET=your_super_secret_random_string_here


