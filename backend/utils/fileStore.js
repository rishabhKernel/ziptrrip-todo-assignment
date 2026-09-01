const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'todos.json');

/**
 * Ensures the data directory and file exist.
 * Initializes with an empty array if the file is missing or corrupt.
 */
function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Reads and parses todos from the JSON file.
 * Returns an empty array on any read/parse error.
 */
function readTodos() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes todos array to the JSON file atomically.
 * Writes to a temp file first, then renames to avoid corruption.
 */
function writeTodos(todos) {
  ensureDataFile();
  const tmpFile = DATA_FILE + '.tmp';
  fs.writeFileSync(tmpFile, JSON.stringify(todos, null, 2), 'utf8');
  fs.renameSync(tmpFile, DATA_FILE);
}

module.exports = { readTodos, writeTodos };
