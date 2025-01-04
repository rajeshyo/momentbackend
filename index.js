const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;
const dbPath = path.join(__dirname, 'db.json');

// ✅ Enable CORS (Allow requests from any origin)
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Helper to read the db.json file
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper to write to the db.json file
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// ✅ GET all users
app.get('/users', (req, res) => {
  const db = readDB();
  res.json(db.users);
});


// ✅ POST - Add a new user
app.post('/users', (req, res) => {
  const db = readDB();
  const newUser = req.body;
  newUser.id = db.users.length + 1; // Auto-increment ID
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json({ message: 'User added successfully!', user: newUser });
});

// ✅ PUT - Update a user by ID
app.put('/users/:id', (req, res) => {
  const db = readDB();
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const userIndex = db.users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    db.users[userIndex] = { ...db.users[userIndex], ...updatedUser };
    writeDB(db);
    res.json({ message: 'User updated successfully!', user: db.users[userIndex] });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// ✅ DELETE - Remove a user by ID
app.delete('/users/:id', (req, res) => {
  const db = readDB();
  const userId = parseInt(req.params.id);

  const filteredUsers = db.users.filter(user => user.id !== userId);
  if (db.users.length !== filteredUsers.length) {
    db.users = filteredUsers;
    writeDB(db);
    res.json({ message: 'User deleted successfully!' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
