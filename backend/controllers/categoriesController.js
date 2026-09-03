import { supabase } from "../lib/supabase.js";


export const getCategories = async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Supabase getCategories error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch categories",
        error: error.message,
      });
    }

    const { data: notes, error: notesError } =
      await supabase
        .from("notes")
        .select("category_id")
        .eq("user_id", userId)
        .eq("is_deleted", false)
        .not("category_id", "is", null);

    if (notesError) {
      console.error(
        "Supabase get category note counts error:",
        notesError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to calculate category counts",
        error: notesError.message,
      });
    }

    /*
      Calculate count for each category.
    */

    const categoriesWithCount = data.map(
      (category) => {
        const count = (notes || []).filter(
          (note) =>
            note.category_id === category.id
        ).length;

        return {
          ...category,
          count,
        };
      }
    );

    return res.json({
      success: true,
      categories: categoriesWithCount,
    });

  } catch (error) {
    console.error(
      "getCategories error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ========================================================= */
/* CREATE CATEGORY */
/* ========================================================= */

export const createCategory = async (req, res) => {
  try {
    const userId = req.userId;

    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const { data: category, error } = await supabase
      .from("categories")
      .insert([
        {
          user_id: userId,
          name: name.trim(),
          color: color || "purple",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase createCategory error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create category",
        error: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};


/* ========================================================= */
/* DELETE CATEGORY */
/* ========================================================= */

export const deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    /* ======================================================= */
    /* CHECK CATEGORY */
    /* ======================================================= */

    const {
      data: category,
      error: findError,
    } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (findError) {
      console.error(
        "Supabase find category error:",
        findError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to find category.",
        error: findError.message,
      });
    }

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    /* ======================================================= */
    /* REMOVE CATEGORY FROM NOTES */
    /* ======================================================= */

    /*
      IMPORTANT:

      Before deleting the category, remove its
      reference from the user's notes.

      This prevents notes from pointing to
      a category that no longer exists.
    */

    const {
      error: notesError,
    } = await supabase
      .from("notes")
      .update({
        category_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("category_id", id);

    if (notesError) {
      console.error(
        "Supabase remove category from notes error:",
        notesError
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to remove category from notes.",
        error: notesError.message,
      });
    }

    /* ======================================================= */
    /* DELETE CATEGORY */
    /* ======================================================= */

    const {
      error: deleteError,
    } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (deleteError) {
      console.error(
        "Supabase deleteCategory error:",
        deleteError
      );

      return res.status(500).json({
        success: false,
        message: "Failed to delete category.",
        error: deleteError.message,
      });
    }

    /* ======================================================= */
    /* RESPONSE */
    /* ======================================================= */

    return res.json({
      success: true,
      message:
        `Category "${category.name}" deleted successfully.`,
    });

  } catch (error) {
    console.error(
      "deleteCategory error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
