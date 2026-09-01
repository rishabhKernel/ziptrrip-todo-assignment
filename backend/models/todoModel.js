const { randomUUID } = require('crypto');

const VALID_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Creates a new Todo object with all required fields.
 */
function createTodo({ title, description = '', priority = 'medium', dueDate = null }) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    priority,
    dueDate: dueDate || null,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Merges updates into an existing todo, updating the updatedAt timestamp.
 * Only updates fields that are explicitly provided.
 */
function updateTodo(existing, updates) {
  const now = new Date().toISOString();
  const updated = { ...existing, updatedAt: now };

  if (updates.title !== undefined) updated.title = updates.title.trim();
  if (updates.description !== undefined) updated.description = updates.description.trim();
  if (updates.completed !== undefined) updated.completed = Boolean(updates.completed);
  if (updates.priority !== undefined && VALID_PRIORITIES.includes(updates.priority)) {
    updated.priority = updates.priority;
  }
  // Allow explicit null to clear dueDate
  if (Object.prototype.hasOwnProperty.call(updates, 'dueDate')) {
    updated.dueDate = updates.dueDate || null;
  }

  return updated;
}

module.exports = { createTodo, updateTodo, VALID_PRIORITIES };
