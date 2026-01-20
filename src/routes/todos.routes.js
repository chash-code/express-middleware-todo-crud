```javascript
const express = require('express');
const router = express.Router();

// Import middleware
const rateLimiterMiddleware = require('../middleware/rateLimiter.middleware');
const validateTodoMiddleware = require('../middleware/validateTodo.middleware');

/**
 * Create Todo - POST /todos/add
 * Uses: Custom validation middleware
 */
router.post('/add', validateTodoMiddleware, (req, res) => {
  const { title } = req.body;

  const newTodo = {
    todoId: String(req.db.todos.length + 1),
    title,
    completed: false
  };

  req.db.todos.push(newTodo);
  req.saveDb();

  res.status(201).json({
    message: 'Todo created successfully',
    todo: newTodo
  });
});

/**
 * Get All Todos - GET /todos
 * Uses: Rate limiting middleware (15 requests per minute)
 */
router.get('/', rateLimiterMiddleware, (req, res) => {
  res.status(200).json({
    count: req.db.todos.length,
    todos: req.db.todos
  });
});

/**
 * Get Single Todo - GET /todos/:todoId
 * No middleware applied
 */
router.get('/:todoId', (req, res) => {
  const { todoId } = req.params;
  const todo = req.db.todos.find(t => t.todoId === todoId);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.status(200).json({ todo });
});

/**
 * Update Todo - PUT /todos/update/:todoId
 * No middleware applied (uses params for update & delete)
 */
router.put('/update/:todoId', (req, res) => {
  const { todoId } = req.params;
  const { title, completed } = req.body;

  const todoIndex = req.db.todos.findIndex(t => t.todoId === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (title) req.db.todos[todoIndex].title = title;
  if (completed !== undefined) req.db.todos[todoIndex].completed = completed;

  req.saveDb();

  res.status(200).json({
    message: 'Todo updated successfully',
    todo: req.db.todos[todoIndex]
  });
});

/**
 * Delete Todo - DELETE /todos/delete/:todoId
 * No middleware applied (uses params for update & delete)
 */
router.delete('/delete/:todoId', (req, res) => {
  const { todoId } = req.params;
  const todoIndex = req.db.todos.findIndex(t => t.todoId === todoId);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const deletedTodo = req.db.todos.splice(todoIndex, 1);
  req.saveDb();

  res.status(200).json({
    message: 'Todo deleted successfully',
    todo: deletedTodo[0]
  });
});

module.exports = router;
```
