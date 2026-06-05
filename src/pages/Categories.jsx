/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CategoryModal from "../components/CategoryModal";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";
import api from "../api";

import { FaFolder, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

import "../styles/categories.css";

export default function Categories() {
  // Core Operational States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control Interactivity States
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // Tracks category during edits
  const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch operational categories array:", err);
    } finally {
      setLoading(false);
    }
  };

  // Triggers the creation modal with no tracking data payload
  const handleCreateClick = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  // Maps targeted cards directly into active memory before showing the modal layout
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (!confirmDeleteCategoryId) return;
    try {
      await api.delete(`/categories/${confirmDeleteCategoryId}`);
      setConfirmDeleteCategoryId(null);
      loadCategories(); // Smoothly sync background elements
    } catch (err) {
      console.error("Category destruction service call dropped:", err);
    }
  };

  return (
    <div className="dashboard-layout-root">
      <Sidebar />

      <main className="categories-page">
        <Topbar
          title="Categories"
          subtitle="Organize your tasks into dedicated structural groups"
        />

        {/* Global Control Bar */}
        <div className="page-actions-bar">
          <button className="primary-action-btn" onClick={handleCreateClick}>
            <FaPlus />
            <span>New Category</span>
          </button>
        </div>

        {/* Workspace Display Conditions */}
        {loading ? (
          <div className="categories-loading-wrapper">
            <div className="loading-spinner"></div>
            <p>Gathering your asset files...</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category) => {
              const catId = category.id || category._id;
              return (
                <div key={catId} className="category-card">
                  <div
                    className="category-card-top-border"
                    style={{
                      backgroundColor: category.color || "var(--color-primary)",
                    }}
                  />

                  <div className="card-accent-header">
                    <div
                      className="category-icon-box"
                      style={{
                        color: category.color || "var(--color-primary)",
                        backgroundColor: category.color
                          ? `${category.color}15`
                          : "var(--color-primary-soft)",
                      }}
                    >
                      <FaFolder />
                    </div>

                    <div className="category-card-actions">
                      <button
                        className="icon-action-btn edit"
                        onClick={() => handleEditClick(category)}
                        title="Edit category details"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="icon-action-btn delete"
                        onClick={() => setConfirmDeleteCategoryId(catId)}
                        title="Delete category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <Link
                    to={`/categories/${catId}`}
                    className="category-details-link"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="category-card-body">
                      <h3>{category.name}</h3>
                      {/* Displays dynamic task counters if provided by your backend payload */}
                      <p className="task-count-indicator">
                        {category.taskCount !== undefined
                          ? `${category.taskCount} active tasks`
                          : "View related tasks"}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No categories yet"
            description="Create your first structural group to bring order to your daily task schedules."
          />
        )}
      </main>

      {/* Shared Modal Handling Creation and Edits seamlessly */}
      <CategoryModal
        open={showModal}
        category={selectedCategory} // Passes data context down cleanly
        onClose={() => {
          setShowModal(false);
          setSelectedCategory(null);
        }}
        onCategorySaved={loadCategories} // Unified lifecycle naming rule
      />

      {confirmDeleteCategoryId && (
        <ConfirmModal
          title="Delete this category?"
          description="Warning: Removing this organizational group may drop associations on currently tracked active tasks."
          onConfirm={confirmDeleteCategory}
          onClose={() => setConfirmDeleteCategoryId(null)}
        />
      )}
    </div>
  );
}
