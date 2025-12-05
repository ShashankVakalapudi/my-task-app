Full Stack Task Manager App

A professional, secure, and modern Task Management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application supports user authentication, task CRUD operations, and is fully responsive.

🚀 Live Demo

Frontend (Live Site): [Insert Your Vercel Link Here]

Backend (API): [Insert Your Render Link Here]

✨ Features

🔐 User Authentication: Secure Registration and Login using JWT (JSON Web Tokens) & HTTP-only cookies.

🛡️ Security: Passwords hashed with bcryptjs, API rate limiting, and strict input validation using express-validator.

📝 Task Management: Full CRUD (Create, Read, Update, Delete) capabilities for tasks.

🔒 Data Isolation: Users can only view and edit their own private tasks.

📱 Responsive Design: Built with Tailwind CSS for a beautiful experience on Mobile, Tablet, and Desktop.

⚡ State Management: Real-time updates and smooth UI interactions using React Hooks.

🗑️ Account Control: Users have full control to permanently delete their account and data.

🛠️ Tech Stack

Component

Technology

Description

Frontend

React (Vite)

Fast, modern UI library

Styling

Tailwind CSS

Utility-first CSS framework

Backend

Node.js & Express

Robust server-side logic

Database

MongoDB Atlas

Cloud NoSQL database

ODM

Mongoose

Elegant MongoDB object modeling

Auth

JWT & Bcrypt

Stateless authentication & encryption

⚙️ Local Installation & Setup

Follow these steps to run the project locally on your machine.

1. Prerequisites

Ensure you have the following installed:

Node.js (v16 or higher)

Git

2. Clone the Repository

git clone [https://github.com/YOUR_USERNAME/task-manager-app.git](https://github.com/YOUR_USERNAME/task-manager-app.git)
cd task-manager-app


3. Backend Setup (The Kitchen)

Navigate to the root directory to set up the server.

Install Dependencies:

npm install


Configure Environment Variables:
Create a .env file in the root folder and add your keys:

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task-manager
JWT_SECRET=your_super_secret_key_123
PORT=5000


Start the Server:

node server.js


Output: 🚀 Server Secure & Running on port 5000

4. Frontend Setup (The Menu)

Open a new terminal and navigate to the client folder.

Go to Client:

cd client


Install Dependencies:

npm install


Configure API URL:
Open src/App.jsx and ensure:

const USE_MOCK_BACKEND = false;
const API_URL = 'http://localhost:5000/api'; // For Local Development


Start React:

npm run dev


Open the link shown (e.g., http://localhost:5173)

🌍 Deployment Guide

This app is optimized for deployment on free cloud platforms.

1. Backend (Render.com)

Create a Web Service connected to your repo.

Build Command: npm install

Start Command: node server.js

Environment Vars: Add MONGO_URI and JWT_SECRET.

2. Frontend (Vercel)

Import your repo to Vercel.

Root Directory: Select client.

Important: Update src/App.jsx before pushing to GitHub:

const API_URL = '[https://your-backend-app.onrender.com/api](https://your-backend-app.onrender.com/api)';


📂 Project Structure

my-task-app/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.jsx         # Main Application Logic
│   │   ├── main.jsx        # Entry Point
│   │   └── index.css       # Tailwind Imports
│   ├── package.json
│   └── vite.config.js
├── server.js               # Node.js Express Backend
├── package.json            # Backend Dependencies
└── README.md               # Documentation


🤝 Contributing

Contributions are welcome!

Fork the project.

Create your Feature Branch (git checkout -b feature/NewFeature).

Commit your changes (git commit -m 'Add NewFeature').

Push to the Branch (git push origin feature/NewFeature).

Open a Pull Request.

Author

Shashank Vakalapudi

GitHub Profile
