export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap" role="search">
      <span className="search-wrap__icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M10 10L13.5 13.5M6 11A5 5 0 106 1a5 5 0 000 10z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        id="search-input"
        type="search"
        className="search-input"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks by title or description"
        autoComplete="off"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
