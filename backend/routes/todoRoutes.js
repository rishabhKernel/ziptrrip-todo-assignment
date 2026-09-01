const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
} = require('../controllers/todoController');
const { validateCreate, validateUpdate } = require('../middleware/validateTodo');

// GET  /api/todos       — list all
router.get('/', getAllTodos);

// GET  /api/todos/:id   — get one
router.get('/:id', getTodoById);

// POST /api/todos       — create
router.post('/', validateCreate, createTodoHandler);

// PUT  /api/todos/:id   — update
router.put('/:id', validateUpdate, updateTodoHandler);

// DELETE /api/todos/:id — delete
router.delete('/:id', deleteTodoHandler);

module.exports = router;
