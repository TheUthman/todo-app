import { FaSearch } from "react-icons/fa";

export default function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search tasks..."
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <button 
        type="button" 
        onClick={onSearch} 
        aria-label="Search"
      >
        <FaSearch />
      </button>
    </div>
  );
}