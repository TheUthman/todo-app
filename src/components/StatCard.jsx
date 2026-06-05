import "../styles/statcard.css";

export default function StatCard({ title, value, icon, color }) {
  // Gracefully fallback to theme accent if color is temporarily left undefined
  const dynamicAccentColor = color || "var(--color-primary)";

  return (
    <div 
      className="stat-card" 
      style={{ "--card-accent-color": dynamicAccentColor }}
    >
      <div className="stat-icon-wrapper">
        {icon}
      </div>

      <div className="stat-info-payload">
        <h3>{typeof value === "number" ? value.toLocaleString() : value ?? 0}</h3>
        <p>{title || "Metric"}</p>
      </div>
    </div>
  );
}