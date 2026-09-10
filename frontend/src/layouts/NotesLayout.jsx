import {useCallback,useEffect,useState,cloneElement,} from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { apiFetch } from "../config/api";

export default function NotesLayout({
  children,
  selectedView,
  onSelectView,
}) {

const [categories, setCategories] = useState([]);

const loadCategories = useCallback(async () => {
  try {
    const response = await apiFetch(
      "/api/categories"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch categories"
      );
    }

    const result = await response.json();

    setCategories(
      result.categories || []
    );

  } catch (error) {
    console.error(
      "Failed to load categories:",
      error
    );
  }
}, []);


/* ========================================================= */
/* INITIAL LOAD CATEGORIES */
/* ========================================================= */

useEffect(() => {
  loadCategories();
}, [loadCategories]);




  /* ========================================================= */
  /* CREATE CATEGORY */
  /* ========================================================= */

  const handleCreateCategory = async ({
    name,
    color,
  }) => {
    try {
      const response = await apiFetch(
        "/api/categories",
        {
          method: "POST",

          body: JSON.stringify({
            name,
            color,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to create category"
        );
      }

      /*
        Add the newly created category
        to the sidebar immediately.
      */

      setCategories((prev) => [
        ...prev,
        result.category,
      ]);

      return result.category;

    } catch (error) {
      console.error(
        "Create category error:",
        error
      );

      throw error;
    }
  };

  /* ========================================================= */
  /* DELETE CATEGORY */
  /* ========================================================= */

  const handleDeleteCategory = async (
    categoryId
  ) => {
    try {
      const response = await apiFetch(
        `/api/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete category"
        );
      }

      /*
        Remove the category from the UI
        immediately after successful deletion.
      */

      setCategories((prev) =>
        prev.filter(
          (category) =>
            category.id !== categoryId
        )
      );

    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      throw error;
    }
  };


  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#080a0d] text-white">

      <Sidebar
        selectedView={selectedView}
        onSelectView={onSelectView}

        /*
          Pass categories to Sidebar.
        */

        categories={categories}

        /*
          Pass category creation handler.
        */

        onCreateCategory={
          handleCreateCategory
        }

        /*
          Pass category deletion handler.
        */

        onDeleteCategory={
          handleDeleteCategory
        }
      />


      {/* ================================================= */}
      {/* Main */}
      {/* ================================================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        <Header />

       <main className="min-h-0 flex-1 overflow-auto">
        {cloneElement(children, {
          categories,
          refreshCategoryCounts: loadCategories,
        })}
      </main>

      </div>

    </div>
  );
}

