import bcrypt from "bcryptjs";
import { supabase } from "../lib/supabase.js";


const sanitizeNote = (note) => {
  if (!note) {
    return note;
  }

  const {
    lock_password_hash,
    ...safeNote
  } = note;

  /*
    IMPORTANT:

    If the note is locked, do NOT send
    the note content to the frontend.

    The content will only be returned
    after the correct password is entered.
  */
  if (safeNote.is_locked === true) {
    safeNote.content = null;
  }

  return safeNote;
};


/* ========================================================= */
/* GET ALL NOTES */
/* ========================================================= */

export const getNotes = async (req, res) => {
  try {
    const userId = req.userId;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Supabase getNotes error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch notes",
        error: error.message,
      });
    }

    /*
      Return both normal and deleted notes.

      The frontend will decide whether to show:
      - normal notes
      - trash notes
      - favorites
      - pinned
    */

    const safeNotes = (data || []).map(
      sanitizeNote
    );

    res.json({
      success: true,
      notes: safeNotes,
    });

  } catch (error) {
    console.error(
      "getNotes error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ========================================================= */
/* GET SINGLE NOTE */
/* ========================================================= */

export const getNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      console.error(
        "Supabase getNote error:",
        error
      );

      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.json({
      success: true,
      note: sanitizeNote(data),
    });

  } catch (error) {
    console.error(
      "getNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ========================================================= */
/* CREATE NOTE */
/* ========================================================= */

export const createNote = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      title,
      content,
      category_id,
      is_favorite,
      is_pinned,
      is_locked,
    } = req.body;

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: userId,

          title:
            title ||
            "Untitled Note",

          content:
            content ?? null,

          category_id:
            category_id || null,

          is_favorite:
            is_favorite ?? false,

          is_pinned:
            is_pinned ?? false,

          is_locked:
            is_locked ?? false,

          lock_password_hash: null,

          is_deleted: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "Supabase createNote error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to create note",
        error: error.message,
      });
    }

    res.status(201).json({
      success: true,
      note: sanitizeNote(data),
    });

  } catch (error) {
    console.error(
      "createNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ========================================================= */
/* UPDATE NOTE */
/* ========================================================= */

export const updateNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const {
      title,
      content,
      category_id,
      is_favorite,
      is_pinned,
      is_locked,
      is_deleted,
      lock_password,
    } = req.body;


    /* ======================================================= */
    /* DEBUG */
    /* ======================================================= */

    console.log(
      "Updating note:",
      id
    );

    console.log(
      "is_locked:",
      is_locked
    );

    console.log(
      "lock_password received:",
      !!lock_password
    );


    /* ======================================================= */
    /* PREPARE UPDATE DATA */
    /* ======================================================= */

    const updateData = {
      title,
      content,
      category_id,
      is_favorite,
      is_pinned,
      is_locked,
      is_deleted,
      updated_at: new Date().toISOString(),
    };


    /* ======================================================= */
    /* HASH LOCK PASSWORD */
    /* ======================================================= */

    /*
      Only hash the password when one
      is provided.

      The frontend sends:

      lock_password: password

      We store:

      lock_password_hash: bcrypt hash
    */

    if (
      typeof lock_password === "string" &&
      lock_password.length > 0
    ) {

      console.log(
        "Hashing lock password..."
      );

      const passwordHash =
        await bcrypt.hash(
          lock_password,
          12
        );

      updateData.lock_password_hash =
        passwordHash;

      console.log(
        "Lock password hash generated."
      );
    }


    /* ======================================================= */
    /* UPDATE DATABASE */
    /* ======================================================= */

    const { data, error } =
      await supabase
        .from("notes")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();


    /* ======================================================= */
    /* SUPABASE ERROR */
    /* ======================================================= */

    if (error) {

      console.error(
        "Supabase updateNote error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update note",
        error: error.message,
      });
    }


    /* ======================================================= */
    /* REMOVE PASSWORD HASH FROM RESPONSE */
    /* ======================================================= */

    const safeNote =
      sanitizeNote(data);


    /* ======================================================= */
    /* RESPONSE */
    /* ======================================================= */

    res.json({
      success: true,
      note: safeNote,
    });

  } catch (error) {

    console.error(
      "updateNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ========================================================= */
/* LOCK NOTE */
/* ========================================================= */

export const lockNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const {
      password,
    } = req.body;


    /* ----------------------------------------------------- */
    /* Validate password */
    /* ----------------------------------------------------- */

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required.",
      });
    }


    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 4 characters.",
      });
    }


    /* ----------------------------------------------------- */
    /* Check note */
    /* ----------------------------------------------------- */

    const {
      data: existingNote,
      error: findError,
    } = await supabase
      .from("notes")
      .select(
        "id, is_locked"
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();


    if (
      findError ||
      !existingNote
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found.",
      });
    }


    /* ----------------------------------------------------- */
    /* Hash password */
    /* ----------------------------------------------------- */

    const passwordHash =
      await bcrypt.hash(
        password,
        12
      );


    /* ----------------------------------------------------- */
    /* Save password hash */
    /* ----------------------------------------------------- */

    /*
      IMPORTANT:

      Use lock_password_hash.

      NOT password_hash.
    */

    const {
      data,
      error,
    } = await supabase
      .from("notes")
      .update({
        is_locked: true,

        lock_password_hash:
          passwordHash,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();


    if (error) {

      console.error(
        "Supabase lockNote error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to lock note.",
        error: error.message,
      });
    }


    /* ----------------------------------------------------- */
    /* Return safe note */
    /* ----------------------------------------------------- */

    res.json({
      success: true,

      message:
        "Note locked successfully.",

      note:
        sanitizeNote(data),
    });

  } catch (error) {

    console.error(
      "lockNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });
  }
};


/* ========================================================= */
/* UNLOCK NOTE */
/* ========================================================= */

export const unlockNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const {
      password,
    } = req.body;


    /* ----------------------------------------------------- */
    /* Validate password */
    /* ----------------------------------------------------- */

    if (!password) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required.",
      });
    }


    /* ----------------------------------------------------- */
    /* Get lock password hash */
    /* ----------------------------------------------------- */

    /*
      IMPORTANT:

      Read lock_password_hash.

      NOT password_hash.
    */

    const {
      data: note,
      error,
    } = await supabase
      .from("notes")
      .select(
        "id, lock_password_hash, is_locked"
      )
      .eq("id", id)
      .eq("user_id", userId)
      .single();


    if (
      error ||
      !note
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Note not found.",
      });
    }


    /* ----------------------------------------------------- */
    /* Verify locked state */
    /* ----------------------------------------------------- */

    if (
      !note.is_locked ||
      !note.lock_password_hash
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This note is not locked.",
      });
    }


    /* ----------------------------------------------------- */
    /* Compare password */
    /* ----------------------------------------------------- */

    const passwordMatches =
      await bcrypt.compare(
        password,
        note.lock_password_hash
      );


    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Incorrect password.",
      });
    }


    /* ----------------------------------------------------- */
    /* Unlock note */
    /* ----------------------------------------------------- */

    const {
      data,
      error: updateError,
    } = await supabase
      .from("notes")
      .update({
        is_locked: false,

        /*
          Remove password hash after
          successfully unlocking.
        */
        lock_password_hash: null,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();


    if (updateError) {

      console.error(
        "Supabase unlockNote error:",
        updateError
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to unlock note.",
        error:
          updateError.message,
      });
    }


    /* ----------------------------------------------------- */
    /* Response */
    /* ----------------------------------------------------- */

    res.json({
      success: true,

      message:
        "Note unlocked successfully.",

      note:
        sanitizeNote(data),
    });

  } catch (error) {

    console.error(
      "unlockNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });
  }
};


/* ========================================================= */
/* DELETE NOTE */
/* ========================================================= */

export const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const {
      data,
      error,
    } = await supabase
      .from("notes")
      .update({
        is_deleted: true,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();


    if (error) {

      console.error(
        "Supabase deleteNote error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update note",
        error: error.message,
      });
    }


    res.json({
      success: true,

      message:
        "Note moved to trash",

      note:
        sanitizeNote(data),
    });

  } catch (error) {

    console.error(
      "deleteNote error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error",
    });
  }
};
