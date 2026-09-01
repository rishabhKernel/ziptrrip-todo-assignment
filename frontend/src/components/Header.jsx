import { Link } from 'react-router-dom';

export default function Header({ onNewTask }) {
  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <Link to="/todos" className="header__logo" aria-label="TaskFlow home">
          <div className="header__logo-mark" aria-hidden="true">T</div>
          <span className="header__logo-text">TaskFlow</span>
          <span className="header__tagline text-faint">· Stay on top of your work</span>
        </Link>

        <div className="header__spacer" />

        {onNewTask && (
          <button
            id="new-task-btn"
            className="btn btn-primary"
            onClick={onNewTask}
            aria-label="Create a new task"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        )}
      </div>
    </header>
  );
}
