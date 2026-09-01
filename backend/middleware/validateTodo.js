const { VALID_PRIORITIES } = require('../models/todoModel');

/**
 * Validates the request body for creating a new Todo.
 */
function validateCreate(req, res, next) {
  const { title, priority, dueDate } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push('Title is required.');
  } else if (title.trim().length > 150) {
    errors.push('Title must be 150 characters or fewer.');
  }

  if (req.body.description && req.body.description.length > 1000) {
    errors.push('Description must be 1000 characters or fewer.');
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (dueDate) {
    const d = new Date(dueDate);
    if (isNaN(d.getTime())) {
      errors.push('Due date must be a valid date.');
    } else {
      // Reject past dates for NEW todos (compare YYYY-MM-DD strings, local server time)
      const t = new Date();
      const todayStr = [
        t.getFullYear(),
        String(t.getMonth() + 1).padStart(2, '0'),
        String(t.getDate()).padStart(2, '0'),
      ].join('-');
      if (dueDate < todayStr) {
        errors.push('Due date cannot be in the past for new tasks.');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  next();
}

/**
 * Validates the request body for updating an existing Todo.
 * All fields are optional on update.
 */
function validateUpdate(req, res, next) {
  const { title, priority, dueDate, completed } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title cannot be empty.');
    } else if (title.trim().length > 150) {
      errors.push('Title must be 150 characters or fewer.');
    }
  }

  if (req.body.description !== undefined && req.body.description.length > 1000) {
    errors.push('Description must be 1000 characters or fewer.');
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}.`);
  }

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const d = new Date(dueDate);
    if (isNaN(d.getTime())) {
      errors.push('Due date must be a valid date.');
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('Completed must be a boolean.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  next();
}

module.exports = { validateCreate, validateUpdate };
