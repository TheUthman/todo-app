import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search tasks...",
}) {
  return (
    <div className="search-bar">
      <FaSearch className="search-bar-icon" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {onSearch && (
        <button type="button" onClick={onSearch} aria-label="Search" className="search-bar-submit">
          <FaSearch />
        </button>
      )}
    </div>
  );
}
