import { FaInbox } from "react-icons/fa";

export default function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FaInbox />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
