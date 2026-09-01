const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'pending',  label: 'Pending' },
  { key: 'completed',label: 'Completed' },
  { key: 'high',     label: '🔥 High' },
  { key: 'medium',   label: 'Medium' },
  { key: 'low',      label: 'Low' },
];

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'oldest',   label: 'Oldest first' },
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate',  label: 'Due date' },
  { value: 'title',    label: 'Title A–Z' },
];

export default function FilterBar({ activeFilter, onFilter, sortBy, onSort }) {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Filter and sort tasks">
      <div className="filter-tabs" role="group" aria-label="Filter by status or priority">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab${activeFilter === f.key ? ' active' : ''}`}
            onClick={() => onFilter(f.key)}
            aria-pressed={activeFilter === f.key}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>

      <label htmlFor="sort-select" className="sr-only">Sort tasks</label>
      <select
        id="sort-select"
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSort(e.target.value)}
        aria-label="Sort tasks"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
