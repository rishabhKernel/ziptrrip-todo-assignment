import { Routes, Route, Navigate } from 'react-router-dom';
import TodoList from './pages/TodoList.jsx';
import TodoDetails from './pages/TodoDetails.jsx';

export default function App() {
  return (
    <Routes>
      {/* Redirect root to /todos */}
      <Route path="/" element={<Navigate to="/todos" replace />} />

      {/* Page 1: Todo Dashboard / List */}
      <Route path="/todos" element={<TodoList />} />

      {/* Page 2: Todo Detail — uses ?id= query parameter */}
      <Route path="/todo" element={<TodoDetails />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/todos" replace />} />
    </Routes>
  );
}
