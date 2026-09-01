const { readTodos, writeTodos } = require('../utils/fileStore');
const { createTodo, updateTodo } = require('../models/todoModel');

/**
 * GET /api/todos
 * Returns all todos, optionally sorted.
 */
async function getAllTodos(req, res, next) {
  try {
    const todos = readTodos();
    res.json({ success: true, data: todos });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/todos/:id
 * Returns a single todo by ID.
 */
async function getTodoById(req, res, next) {
  try {
    const todos = readTodos();
    const todo = todos.find((t) => t.id === req.params.id);

    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    res.json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/todos
 * Creates a new todo and persists it.
 */
async function createTodoHandler(req, res, next) {
  try {
    const todo = createTodo(req.body);
    const todos = readTodos();
    todos.unshift(todo); // newest first
    writeTodos(todos);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/todos/:id
 * Updates an existing todo by ID.
 */
async function updateTodoHandler(req, res, next) {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    const updated = updateTodo(todos[index], req.body);
    todos[index] = updated;
    writeTodos(todos);

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/todos/:id
 * Deletes a todo by ID.
 */
async function deleteTodoHandler(req, res, next) {
  try {
    const todos = readTodos();
    const index = todos.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    const [deleted] = todos.splice(index, 1);
    writeTodos(todos);

    res.json({ success: true, data: deleted, message: 'Todo deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
};
