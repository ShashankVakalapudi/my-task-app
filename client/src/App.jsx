import React, { useState, useEffect } from 'react';
import { 
  Trash2, Edit2, Plus, LogOut, CheckCircle, 
  Search, Calendar, Flag, LayoutDashboard, ListTodo,
  User, Lock, Mail, Menu, X, ShieldCheck, UserX
} from 'lucide-react';

/**
 * --- CONFIGURATION ---
 * Set this to false to connect to your secure Node.js backend.
 */
const USE_MOCK_BACKEND = false; 
// For Localhost, use this:
// Use environment variable if available, otherwise fall back to localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://task-manager-qeye.onrender.com';
// --- UTILS ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getPriorityColor = (p) => {
  switch(p) {
    case 'High': return 'text-red-600 bg-red-50 border-red-100';
    case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
    case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100';
    default: return 'text-gray-600 bg-gray-50 border-gray-100';
  }
};

// --- API LAYER ---
const api = {
  // Helpers to manage Auth State
  getToken: () => localStorage.getItem('token'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  
  setAuth: (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // LOGIN
  login: async (email, password) => {
    if (USE_MOCK_BACKEND) {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (!foundUser) throw new Error('Invalid email or password (Mock Mode)');
      
      const response = { 
        user: { name: foundUser.name, email: foundUser.email, id: foundUser.id }, 
        token: 'mock-token-' + Date.now() 
      };
      api.setAuth(response);
      return response;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        try {
          const jsonError = JSON.parse(errorText);
          throw new Error(jsonError.message || 'Login failed');
        } catch (e) {
           throw new Error(errorText || 'Login failed'); 
        }
      }
      
      const data = await res.json();
      api.setAuth(data);
      return data;
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Is "node server.js" running?');
      }
      throw err;
    }
  },

  // REGISTER
  register: async (name, email, password) => {
    if (USE_MOCK_BACKEND) {
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      if (users.find(u => u.email === email)) throw new Error('User already exists');
      
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem('mock_users', JSON.stringify(users));
      return { message: "Registered! Please login." };
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        try {
           const jsonError = JSON.parse(errorText);
           throw new Error(jsonError.message || 'Registration failed');
        } catch(e) {
           throw new Error(errorText || 'Registration failed');
        }
      }
      return await res.json();
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Is "node server.js" running?');
      }
      throw err;
    }
  },

  // DELETE ACCOUNT
  deleteAccount: async () => {
    const user = api.getUser();
    if (!user) return;

    if (USE_MOCK_BACKEND) {
      // 1. Remove User
      const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
      const newUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('mock_users', JSON.stringify(newUsers));

      // 2. Remove User's Tasks
      const tasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      const newTasks = tasks.filter(t => t.userId !== user.id);
      localStorage.setItem('mock_tasks', JSON.stringify(newTasks));
      return;
    }

    // Real Backend
    const res = await fetch(`${API_URL}/auth/user`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${api.getToken()}` }
    });
    
    if (!res.ok) throw new Error('Failed to delete account');
  },

  // GET TASKS
  getTasks: async () => {
    const user = api.getUser();
    if (USE_MOCK_BACKEND) {
      const allTasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      return allTasks.filter(t => t.userId === user.id);
    }
    
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${api.getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
  },

  // SAVE TASK
  saveTask: async (task) => {
    const user = api.getUser();
    if (USE_MOCK_BACKEND) {
      const allTasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      
      if (task._id) {
        // Update
        const idx = allTasks.findIndex(t => t._id === task._id);
        if (idx !== -1) allTasks[idx] = { ...allTasks[idx], ...task };
      } else {
        // Create
        const newTask = { ...task, _id: Date.now().toString(), userId: user.id, completed: false };
        allTasks.push(newTask);
      }
      localStorage.setItem('mock_tasks', JSON.stringify(allTasks));
      return task;
    }

    const method = task._id ? 'PUT' : 'POST';
    const url = task._id ? `${API_URL}/tasks/${task._id}` : `${API_URL}/tasks`;
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api.getToken()}` 
      },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to save task');
    return await res.json();
  },

  // DELETE TASK
  deleteTask: async (id) => {
    if (USE_MOCK_BACKEND) {
      const allTasks = JSON.parse(localStorage.getItem('mock_tasks') || '[]');
      const filtered = allTasks.filter(t => t._id !== id);
      localStorage.setItem('mock_tasks', JSON.stringify(filtered));
      return;
    }
    await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${api.getToken()}` }
    });
  }
};

// --- COMPONENTS ---

const TaskCard = ({ task, onToggle, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 group">
    <div className="flex items-start gap-4">
      <button 
        onClick={() => onToggle(task)}
        className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-indigo-500'
        }`}
      >
        <CheckCircle size={14} className={task.completed ? 'block' : 'hidden'} />
      </button>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className={`font-semibold text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50">
              <Edit2 size={16} />
            </button>
            <button onClick={() => onDelete(task._id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}

        <div className="flex items-center gap-3 mt-3">
          <span className={`text-xs px-2 py-1 rounded-md border font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
            <Flag size={10} /> {task.priority}
          </span>
          {task.dueDate && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard = ({ user, logout }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', dueDate: '' });

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.saveTask({ ...formData, _id: editingTask?._id });
    setIsModalOpen(false);
    loadTasks();
  };

  const handleToggle = async (task) => {
    await api.saveTask({ ...task, completed: !task.completed });
    loadTasks();
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure? This will delete your account and ALL your tasks permanently.")) {
      try {
        await api.deleteAccount();
        logout();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(task || { title: '', description: '', priority: 'Medium', dueDate: '' });
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter(t => 
    filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="bg-white border-r border-gray-200 w-full md:w-64 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span className="font-bold text-gray-800 text-lg">TaskPro</span>
        </div>
        
        <nav className="p-4 space-y-1 flex-1">
          <button onClick={() => setFilter('all')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setFilter('active')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === 'active' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ListTodo size={18} /> My Tasks
          </button>
          <button onClick={() => setFilter('completed')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <CheckCircle size={18} /> Completed
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 p-2 rounded-lg text-sm font-medium transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
          <button onClick={handleDeleteAccount} className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-lg text-sm font-medium transition-colors">
            <UserX size={16} /> Delete Account
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filter === 'all' ? 'Dashboard' : filter === 'active' ? 'Active Tasks' : 'Completed Tasks'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage your professional workflow</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <Plus size={18} /> New Task
          </button>
        </header>

        {USE_MOCK_BACKEND && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>Demo Mode Active. Tasks are filtered by browser (Local Storage).</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ListTodo size={32} />
              </div>
              <h3 className="text-gray-900 font-medium">No tasks found</h3>
              <p className="text-gray-500 text-sm">Create a new task to get started</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                onToggle={handleToggle}
                onEdit={openModal} 
                onDelete={(id) => { if(window.confirm('Delete?')) { api.deleteTask(id); loadTasks(); } }} 
              />
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input required className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white outline-none" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none h-24 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-100">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Auth = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        await api.register(formData.name, formData.email, formData.password);
        alert("Account created! Please sign in.");
        setIsRegister(false);
      } else {
        const data = await api.login(formData.email, formData.password);
        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 text-center bg-indigo-600">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-indigo-100">{isRegister ? 'Join us to secure your tasks' : 'Sign in to access your workspace'}</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="email" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="name@company.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input required type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
            
            {error && <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            
            <button disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-70 mt-2">
              {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  
  // FIX: Load user from local storage on reload
  useEffect(() => {
    const storedUser = api.getUser();
    if(storedUser) setUser(storedUser);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
  };

  return user ? <Dashboard user={user} logout={handleLogout} /> : <Auth onLogin={handleLogin} />;
}
