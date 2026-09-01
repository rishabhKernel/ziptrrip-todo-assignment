export default function TodoStats({ todos }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = todos.filter((t) => t.priority === 'high' && !t.completed).length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section aria-label="Task statistics">
      <div className="stats-grid">
        <StatCard
          label="Total Tasks"
          value={total}
          icon="📋"
          variant="primary"
          id="stat-total"
        />
        <StatCard
          label="Completed"
          value={completed}
          icon="✅"
          variant="success"
          id="stat-completed"
        />
        <StatCard
          label="Pending"
          value={pending}
          icon="⏳"
          variant=""
          id="stat-pending"
        />
        <StatCard
          label="High Priority"
          value={highPriority}
          icon="🔥"
          variant="danger"
          id="stat-high-priority"
        />
        <ProgressCard pct={pct} id="stat-progress" />
      </div>
    </section>
  );
}

function StatCard({ label, value, icon, variant, id }) {
  return (
    <div className={`stat-card stat-card--${variant}`} id={id} role="group" aria-label={label}>
      <div className="stat-card__icon" aria-hidden="true">{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function ProgressCard({ pct, id }) {
  return (
    <div className="stat-card" id={id} role="group" aria-label="Completion percentage">
      <div className="stat-card__icon" aria-hidden="true">📈</div>
      <div className="stat-card__value">{pct}%</div>
      <div className="stat-card__label">Complete</div>
      <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
