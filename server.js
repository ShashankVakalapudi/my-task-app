/**
 * SECURE PRODUCTION BACKEND
 * Fixes:
 * 1. Strict Password Validation (Bcrypt)
 * 2. Data Isolation (Users only see their own data)
 * 3. Input Validation
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || "CHANGE_THIS_TO_A_COMPLEX_SECRET_KEY";

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECT ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Database Connected & Secure"))
  .catch(err => console.error("❌ DB Error:", err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // STRICT LINK TO USER
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

// --- AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Session Expired" });
    req.user = decoded; // Contains { id, name, email }
    next();
  });
};

// --- ROUTES ---

// 1. REGISTER
app.post('/api/auth/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Strict Password Check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET TASKS (Filtered by User)
app.get('/api/tasks', authenticate, async (req, res) => {
  // CRITICAL FIX: Only find tasks belonging to req.user.id
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// 4. CREATE TASK
app.post('/api/tasks', authenticate, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.id }); // Attach current user ID
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. UPDATE TASK
app.put('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    // CRITICAL FIX: Ensure user owns the task before updating
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. DELETE TASK
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    // CRITICAL FIX: Ensure user owns the task before deleting
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!result) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server Secure & Running on port ${PORT}`));

// ... existing code ...

// 7. DELETE ACCOUNT (New Feature)
app.delete('/api/auth/user', authenticate, async (req, res) => {
  try {
    // 1. Delete all tasks belonging to this user
    await Task.deleteMany({ userId: req.user.id });
    // 2. Delete the user account
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server Secure & Running on port ${PORT}`));
