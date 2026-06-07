import "../styles/card.css";

export default function Card({ children, className = "" }) {
  return <div className={`surface-card ${className}`.trim()}>{children}</div>;
}
