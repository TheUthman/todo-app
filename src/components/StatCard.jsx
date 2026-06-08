import "../styles/statcard.css";

export default function StatCard({
  title,
  value,
  icon,
  color,
  trend,
  trendValue,
  progress,
}) {
  // Gracefully fallback to theme accent if color is temporarily left undefined
  const dynamicAccentColor = color || "var(--color-primary)";

  return (
    <div
      className="stat-card"
      style={{ "--card-accent-color": dynamicAccentColor }}
    >
      <div className="stat-icon-wrapper">{icon}</div>

      <div className="stat-info-payload">
        <h3>
          {typeof value === "number" ? value.toLocaleString() : (value ?? 0)}
        </h3>
        <p>{title || "Metric"}</p>

        {trend && (
          <div className={`stat-trend trend-${trend}`}>
            <span className="trend-icon">{trend === "up" ? "↑" : "↓"}</span>
            <span className="trend-value">{trendValue}%</span>
            <span className="trend-label">vs last period</span>
          </div>
        )}

        {progress !== undefined && (
          <div className="stat-progress-wrapper">
            <div className="stat-progress-track">
              <div
                className="stat-progress-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: dynamicAccentColor,
                }}
              />
            </div>
            <span className="stat-progress-text">{progress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
