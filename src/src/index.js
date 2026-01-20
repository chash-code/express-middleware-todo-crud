```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Import middleware
const loggerMiddleware = require('./middleware/logger.middleware');

// Middleware
app.use(express.json());

// Apply app-level middleware (logger)
app.use(loggerMiddleware);

// Load database
const dbPath = path.join(__dirname, 'db.json');
let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Make db accessible to routes
app.use((req, res, next) => {
  req.db = db;
  req.saveDb = () => {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  };
  next();
});

// Import routes
const todoRoutes = require('./routes/todos.routes');

// Use routes
app.use('/todos', todoRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Express Middleware Todo API',
    endpoints: {
      todos: '/todos',
      features: [
        'App-level logging middleware',
        'Route-level rate limiting',
        'Custom validation middleware'
      ]
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```
