import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/react";

import NoteList from "../components/notes/NoteList";
import NoteEditor from "../components/notes/NoteEditor";
import { apiFetch } from "../config/api";

export default function Notes({
  selectedView,
  categories = [],
  refreshCategoryCounts,
}) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  /* ========================================================= */
  /* Notes */
  /* ========================================================= */

  const [notes, setNotes] = useState([]);

  /* ========================================================= */
  /* Selected Note */
  /* ========================================================= */

  const [selectedNote, setSelectedNote] = useState(null);

  /* ========================================================= */
  /* Loading / Error */
  /* ========================================================= */

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ========================================================= */
  /* Convert Supabase Note → Frontend Note */
  /* ========================================================= */

const getCategoryColorClass = (color) => {
  const colorMap = {
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    yellow: "bg-yellow-400",
    green: "bg-green-500",
    orange: "bg-orange-400",
    red: "bg-red-500",
    cyan: "bg-cyan-400",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-400",
  };

  return color ? colorMap[color] || null : null;
};

const getCategoryTextColorClass = (color) => {
  const colorMap = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    pink: "text-pink-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
    orange: "text-orange-400",
    red: "text-red-400",
    cyan: "text-cyan-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
  };

  return color ? colorMap[color] || null : null;
};

const formatNote = (note) => {
  let preview = "";

  if (note.content) {
    preview = note.content
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 60);

    if (
      note.content
        .replace(/<[^>]*>/g, "")
        .trim()
        .length > 60
    ) {
      preview += "...";
    }
  }

  /* ========================================================= */
  /* CATEGORY FROM DATABASE */
  /* ========================================================= */

const categoryData = note.category_id
  ? categories.find(
      (item) =>
        item.id === note.category_id
    )
  : null;

const categoryColor =
  categoryData?.color || null;

  /* ========================================================= */
  /* RETURN FRONTEND NOTE */
  /* ========================================================= */

  return {
    ...note,

    preview,

    label: categoryData?.name || null,

    date: note.updated_at
      ? new Date(
          note.updated_at
        ).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "",

    /* ======================================================= */
    /* CATEGORY */
    /* ======================================================= */

    color:
      getCategoryColorClass(
        categoryColor
      ),

    textColor:
      getCategoryTextColorClass(
        categoryColor
      ),

    categoryColor,

    categoryId:
      categoryData?.id || null,

    /* ======================================================= */
    /* NOTE STATES */
    /* ======================================================= */

    pinned:
      note.is_pinned === true,

    starred:
      note.is_favorite === true,

    locked:
      note.is_locked === true,

    deleted:
      note.is_deleted === true,
  };
};

  /* ========================================================= */
  /* GET NOTES FROM BACKEND */
  /* ========================================================= */

  useEffect(() => {
    const fetchNotes = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setNotes([]);
        setSelectedNote(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        /* --------------------------------------------------- */
        /* Get Clerk authentication token */
        /* --------------------------------------------------- */

        const token = await getToken();

        if (!token) {
          throw new Error(
            "Clerk authentication token is missing."
          );
        }

        /* --------------------------------------------------- */
        /* Call backend */
        /* --------------------------------------------------- */

        

        const response = await apiFetch(
          "/api/notes",
          {
            method: "GET",
          },
          token
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch notes"
          );
        }

        /* --------------------------------------------------- */
        /* Convert database notes to frontend notes */
        /* --------------------------------------------------- */

        const formattedNotes = (result.notes || []).map(
          formatNote
        );

        setNotes(formattedNotes);

        /* --------------------------------------------------- */
        /* Automatically select first note */
        /* --------------------------------------------------- */

        if (formattedNotes.length > 0) {
          setSelectedNote(formattedNotes[0]);
        } else {
          setSelectedNote(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch notes:",
          error
        );

        setError(error.message);

        setNotes([]);
        setSelectedNote(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
}, [
  isLoaded,
  isSignedIn,
  getToken,
  categories,
]);



  /* ========================================================= */
  /* CREATE NEW NOTE */
  /* ========================================================= */

  const createNewNote = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      console.warn(
        "Cannot create note: user is not signed in."
      );

      return;
    }

    try {
      setError(null);

      /* --------------------------------------------------- */
      /* Get Clerk authentication token */
      /* --------------------------------------------------- */

      const token = await getToken();

      if (!token) {
        throw new Error(
          "Clerk authentication token is missing."
        );
      }

      /* --------------------------------------------------- */
      /* Create empty note */
      /*
         We intentionally send:
         
         title: "Untitled Note"
         content: null
         
         The backend will also apply these defaults,
         but sending them explicitly makes the behavior
         clear.
      */
      /* --------------------------------------------------- */

      const response = await apiFetch(
        "/api/notes",
        {
          method: "POST",

          body: JSON.stringify({
            title: "Untitled Note",
            content: null,
            category: null,
            is_favorite: false,
            is_pinned: false,
            is_locked: false,
          }),
        },
        token
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create note"
        );
      }

      /* --------------------------------------------------- */
      /* Convert newly created note */
      /* --------------------------------------------------- */

      const newNote = formatNote(result.note);

      /* --------------------------------------------------- */
      /* Add new note to beginning of notes */
      /* --------------------------------------------------- */

      setNotes((currentNotes) => [
        newNote,
        ...currentNotes,
      ]);

      /* --------------------------------------------------- */
      /* Automatically open the new note */
      /* --------------------------------------------------- */

      setSelectedNote(newNote);

      console.log(
        "New note created:",
        newNote
      );
    } catch (error) {
      console.error(
        "Failed to create new note:",
        error
      );

      setError(error.message);
    }
}, [
  getToken,
  isLoaded,
  isSignedIn,
  categories,
]);

  /* ========================================================= */
  /* Listen for New Note Button */
  /* ========================================================= */

  useEffect(() => {
    const handleNewNote = () => {
      createNewNote();
    };

    window.addEventListener(
      "create-new-note",
      handleNewNote
    );

    return () => {
      window.removeEventListener(
        "create-new-note",
        handleNewNote
      );
    };
  }, [createNewNote]);

  /* ========================================================= */
  /* Select Note */
  /* ========================================================= */

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  /* ========================================================= */
  /* Update Note */
  /* ========================================================= */

  const handleUpdateNote = async (updatedNote) => {
  try {
    setError(null);

    /* --------------------------------------------------- */
    /* Get Clerk authentication token */
    /* --------------------------------------------------- */

    const token = await getToken();

    if (!token) {
      throw new Error(
        "Clerk authentication token is missing."
      );
    }

    /* --------------------------------------------------- */
    /* Update note in backend */
    /* --------------------------------------------------- */

      const response = await apiFetch(
        `/api/notes/${updatedNote.id}`,
        {
          method: "PUT",

          body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content,

          // Category
          category_id: updatedNote.category_id,
          category: updatedNote.category,

          // Note states
          is_favorite: updatedNote.is_favorite,
          is_pinned: updatedNote.is_pinned,
          is_locked: updatedNote.is_locked,
          is_deleted: updatedNote.is_deleted,

          lock_password: updatedNote.lock_password,
        }),
      },
      token
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to update note"
      );
    }

    /* --------------------------------------------------- */
    /* Convert backend note */
    /* --------------------------------------------------- */

    const formattedNote =
      formatNote(result.note);


      /* ===================================================== */
      /* REFRESH CATEGORY COUNTS */
      /* ===================================================== */

      if (refreshCategoryCounts) {
        await refreshCategoryCounts();
      }

    /* ===================================================== */
    /* UPDATE NOTES + SELECT NEXT NOTE */
    /* ===================================================== */

    setNotes((currentNotes) => {

      const updatedNotes =
        currentNotes.map((note) =>
          note.id === formattedNote.id
            ? formattedNote
            : note
        );


      /* ================================================= */
      /* CURRENT NOTE WAS LOCKED */
      /* ================================================= */

      if (formattedNote.is_locked === true) {

        /*
          Find another unlocked note.
        */

        const nextUnlockedNote =
          updatedNotes.find(
            (note) =>
              note.id !== formattedNote.id &&
              note.is_locked !== true &&
              note.is_deleted !== true
          );


        /* ----------------------------------------------- */
        /* Found another unlocked note */
        /* ----------------------------------------------- */

        if (nextUnlockedNote) {

          console.log(
            "Opening next unlocked note:",
            nextUnlockedNote
          );

          setSelectedNote(
            nextUnlockedNote
          );

        }


        /* ----------------------------------------------- */
        /* No unlocked notes */
        /* ----------------------------------------------- */

        else {

          console.log(
            "All notes are locked. Keeping locked note selected."
          );

          setSelectedNote(
            formattedNote
          );

        }

      }


      /* ================================================= */
      /* NORMAL NOTE UPDATE */
      /* ================================================= */

      else {

        setSelectedNote(
          formattedNote
        );

      }


      return updatedNotes;

    });

  } catch (error) {

    console.error(
      "Failed to update note:",
      error
    );

    setError(
      error.message
    );
  }
};


const handleUnlockNote = async (
  noteId,
  password
) => {
  try {
    setError(null);

    const token = await getToken();

    if (!token) {
      throw new Error(
        "Clerk authentication token is missing."
      );
    }

    const response = await apiFetch(
      `/api/notes/${noteId}/unlock`,
      {
        method: "POST",

        body: JSON.stringify({
          password,
        }),
      },
      token
    );

    const result = await response.json();

    /* ===================================================== */
    /* DEBUG UNLOCK RESPONSE */
    /* ===================================================== */

    console.log("=================================");
    console.log(
      "UNLOCK API RESPONSE:",
      result
    );

    console.log(
      "UNLOCKED NOTE:",
      result.note
    );

    console.log(
      "IS LOCKED:",
      result.note?.is_locked
    );

    console.log(
      "CONTENT:",
      result.note?.content
    );

    console.log("=================================");


    /* ===================================================== */
    /* Check API response */
    /* ===================================================== */

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Incorrect password."
      );
    }


    /* ===================================================== */
    /* Format unlocked note */
    /* ===================================================== */

    const formattedNote =
      formatNote(result.note);


    console.log(
      "FORMATTED UNLOCKED NOTE:",
      formattedNote
    );


    /* ===================================================== */
    /* Update notes list */
    /* ===================================================== */

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === formattedNote.id
          ? formattedNote
          : note
      )
    );


    /* ===================================================== */
    /* Update selected note */
    /* ===================================================== */

    setSelectedNote(formattedNote);


    console.log(
      "SELECTED NOTE UPDATED:",
      formattedNote
    );


    return formattedNote;

  } catch (error) {

    console.error(
      "Failed to unlock note:",
      error
    );

    throw error;
  }
};


/* ========================================================= */
/* SELECTED VIEW DISPLAY NAME */
/* ========================================================= */

const selectedCategory = categories.find(
  (category) => category.id === selectedView
);

const selectedViewName =
  selectedCategory?.name || selectedView;



/* ========================================================= */
/* Filter Notes Based On Sidebar */
/* ========================================================= */

const filteredNotes = notes.filter((note) => {
  /* ======================================================= */
  /* FAVORITES */
  /* ======================================================= */

  if (selectedView === "Favorites") {
    return (
      note.starred === true &&
      note.deleted !== true
    );
  }

  /* ======================================================= */
  /* PINNED */
  /* ======================================================= */

  if (selectedView === "Pinned") {
    return (
      note.pinned === true &&
      note.deleted !== true
    );
  }

  /* ======================================================= */
  /* TRASH */
  /* ======================================================= */

  if (selectedView === "Trash") {
    return note.deleted === true;
  }

  /* ======================================================= */
  /* CATEGORY */
  /* ======================================================= */

  const selectedCategory = categories.find(
    (category) =>
      category.id === selectedView
  );

  if (selectedCategory) {
    return (
      note.category_id === selectedCategory.id &&
      note.deleted !== true
    );
  }

  /* ======================================================= */
  /* ALL NOTES */
  /* ======================================================= */

  return note.deleted !== true;
});

  /* ========================================================= */
  /* Keep Selected Note Valid When Filtering */
  /* ========================================================= */

useEffect(() => {
  if (filteredNotes.length === 0) {
    setSelectedNote(null);
    return;
  }

  const selectedStillVisible = filteredNotes.some(
    (note) => note.id === selectedNote?.id
  );

  if (!selectedStillVisible) {
    setSelectedNote(filteredNotes[0]);
  }
}, [selectedView, notes, categories]);

/* ========================================================= */
/* Clerk Loading */
/* ========================================================= */

if (!isLoaded) {
  return null;
}

  /* ========================================================= */
  /* Error */
  /* ========================================================= */

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-red-400">
            Failed to load notes
          </p>

          <p className="text-sm text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }


  const handleCancelLockedNote = () => {
  const anotherUnlockedNote = filteredNotes.find(
    (note) =>
      note.id !== selectedNote?.id &&
      note.is_locked !== true
  );

  if (anotherUnlockedNote) {
    setSelectedNote(anotherUnlockedNote);
    return;
  }

  // If every note is locked, keep the current locked note.
  // NoteEditor will keep the unlock modal open.
};

  /* ========================================================= */
  /* Render */
  /* ========================================================= */

  return (
    <div className="h-full p-2">

      <div className="flex h-full gap-3">

        {/* ================================================= */}
        {/* Notes List */}
        {/* ================================================= */}

        <NoteList
            notes={filteredNotes}
            selectedNote={selectedNote}
            onSelectNote={handleSelectNote}
            selectedView={selectedView}
            categories={categories}
          />

        {/* ================================================= */}
        {/* Note Editor */}
        {/* ================================================= */}

        <NoteEditor
            note={selectedNote}
            categories={categories}
            onUpdateNote={handleUpdateNote}
            onUnlockNote={handleUnlockNote}
            onCancelUnlock={handleCancelLockedNote}
            selectedView={selectedView}
        />

      </div>

    </div>
  );
}

