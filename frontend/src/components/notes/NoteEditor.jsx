import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import UnlockNoteModal from "./UnlockNoteModal";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { ImageResize } from "tiptap-extension-resize-image";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import LockNoteModal from "./LockNoteModal";
import { common, createLowlight } from "lowlight";
import { ChevronDown } from "lucide-react";
import EditorToolbar from "./editor/EditorToolbar";
import EditorHeader from "./editor/EditorHeader";
import {detectLanguage,handleEditorPaste,} from "./utils/detectLanguage";
import { addImageFromFilePicker } from "./utils/imageHandler";


const lowlight = createLowlight(common);

/* ========================================================= */
/* Main Note Editor */
/* ========================================================= */

export default function NoteEditor({
  note,
  categories = [],
  onUpdateNote,
  onUnlockNote,
  onCancelUnlock,
  selectedView,
}) {

  /* ======================================================= */
  /* Category */
  /* ======================================================= */

const [categoryId, setCategoryId] = useState(
  note?.category_id || null
);

const [categoryOpen, setCategoryOpen] = useState(false);

  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] =
    useState(
      note?.locked === true ||
      note?.is_locked === true
    );

  /* ======================================================= */
  /* Content Save Refs */
  /* ======================================================= */

  /*
    Stores the latest editor HTML.

    IMPORTANT:
    We do NOT update the backend while typing.

    Tiptap updates this ref only.
  */
  const pendingContentRef = useRef(
    note?.content || ""
  );

const saveTimeoutRef = useRef(null);
  /*
    Stores the note ID currently loaded
    inside the editor.
  */
  const editorNoteIdRef = useRef(
    note?.id || null
  );


  /*
    Stores the last content that was
    loaded/saved.

    This allows us to determine whether
    the content actually changed.
  */
  const savedContentRef = useRef(
    note?.content || ""
  );


  /* ======================================================= */
  /* Categories */
  /* ======================================================= */

const CATEGORY_COLOR_MAP = {
  blue: {
    color: "bg-blue-500",
    textColor: "text-blue-400",
  },

  purple: {
    color: "bg-purple-500",
    textColor: "text-purple-400",
  },

  pink: {
    color: "bg-pink-500",
    textColor: "text-pink-400",
  },

  yellow: {
    color: "bg-yellow-400",
    textColor: "text-yellow-400",
  },

  green: {
    color: "bg-green-500",
    textColor: "text-green-400",
  },

  orange: {
    color: "bg-orange-400",
    textColor: "text-orange-400",
  },

  red: {
    color: "bg-red-500",
    textColor: "text-red-400",
  },

  cyan: {
    color: "bg-cyan-400",
    textColor: "text-cyan-400",
  },

  indigo: {
    color: "bg-indigo-500",
    textColor: "text-indigo-400",
  },

  emerald: {
    color: "bg-emerald-400",
    textColor: "text-emerald-400",
  },
};


const getCategoryColors = (color) => {
  return (
    CATEGORY_COLOR_MAP[color] ||
    CATEGORY_COLOR_MAP.purple
  );
};

  /* ======================================================= */
  /* Selected Category */
  /* ======================================================= */
const selectedCategory = categoryId
  ? categories.find(
      (item) => item.id === categoryId
    )
  : null;

const selectedCategoryColors = selectedCategory
  ? getCategoryColors(selectedCategory.color)
  : {
      color: "bg-gray-500",
      textColor: "text-gray-500",
    };


  /* ======================================================= */
  /* Save Editor Content */
  /* ======================================================= */

const saveEditorContent = () => {
  if (!note || selectedView === "Trash") {
    return;
  }

    /*
      Get the latest HTML from Tiptap.
    */
    const currentContent =
      pendingContentRef.current || "";


    /*
      Do nothing if content did not change.
    */
    if (
      currentContent ===
      (savedContentRef.current || "")
    ) {
      return;
    }


    console.log(
      "Saving note content..."
    );


    /*
      Update the frontend state.

      Notes.jsx will then send the
      content to the backend.
    */
    onUpdateNote({
      ...note,

      content: currentContent,
    });


    /*
      Mark this content as saved so
      we don't save it again unnecessarily.
    */
    savedContentRef.current =
      currentContent;
  };


  /* ======================================================= */
  /* Tiptap Editor */
  /* ======================================================= */

const editor = useEditor({

  /* ===================================================== */
  /* Extensions */
  /* ===================================================== */

  extensions: [

    StarterKit.configure({
      codeBlock: false,
      link: false,
      underline: false,
    }),

    Underline,

    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
    }),

    ImageResize.configure({
      inline: false,
      allowBase64: true,
      minWidth: 100,
      maxWidth: 1200,
      HTMLAttributes: {
        class: "editor-image",
      },
    }),

    TaskList,

    TaskItem.configure({
      nested: true,
    }),

    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "plaintext",
      enableTabIndentation: true,
      tabSize: 2,
    }),

  ],


  /* ===================================================== */
  /* Note Content */
  /* ===================================================== */

  content:
    note?.is_locked === true
      ? ""
      : note?.content || "",


  /* ===================================================== */
  /* Editable */
  /* ===================================================== */

  /*
    Normal Notes:
      Editor is editable.

    Trash:
      Editor becomes read-only.
  */
  editable: selectedView !== "Trash",


  /* ===================================================== */
  /* Editor Props */
  /* ===================================================== */

  editorProps: {

    attributes: {
      class:
        "prose prose-invert max-w-none min-h-[400px] px-5 py-4 outline-none text-gray-300",

      spellcheck: "false",
    },


    /* --------------------------------------------------- */
    /* Paste */
    /* --------------------------------------------------- */

    handlePaste(view, event) {

      /*
        Prevent pasting into Trash.
      */
      if (selectedView === "Trash") {
        return true;
      }

      return handleEditorPaste(
        editor,
        event,
        detectLanguage
      );
    },


    /* --------------------------------------------------- */
    /* Blur */
    /* --------------------------------------------------- */

    handleDOMEvents: {

      blur() {

        /*
          Do not save content while viewing Trash.
        */
        if (selectedView === "Trash") {
          return false;
        }

        /*
          The user clicked outside
          the editor.

          Save the current content now.
        */
        saveEditorContent();

        return false;
      },

    },

  },


  /* ===================================================== */
  /* IMPORTANT: DO NOT SAVE HERE */
  /* ===================================================== */

  onUpdate: ({ editor }) => {
  if (selectedView === "Trash") {
    return;
  }

  // Store latest content immediately
  pendingContentRef.current = editor.getHTML();

  // Cancel previous save timer
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }

  // Save 500ms after the user stops typing
  saveTimeoutRef.current = setTimeout(() => {
    saveEditorContent();
  }, 500);
},

});

useEffect(() => {
  return () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };
}, []);

  /* ========================================================= */
  /* Load Selected Note Content */
  /* ========================================================= */

 useEffect(() => {

  if (!editor) {
    return;
  }

  editorNoteIdRef.current =
    note?.id || null;


  /*
    LOCKED NOTE

    Do NOT load the content into
    Tiptap.
  */

  if (note?.is_locked === true) {

    pendingContentRef.current = "";

    savedContentRef.current = "";

    setUnlockModalOpen(true);

    editor.commands.clearContent(
      false
    );

    return;
  }


  /*
    UNLOCKED NOTE

    Load the actual content.
  */

  const content =
    note?.content || "";

  pendingContentRef.current =
    content;

  savedContentRef.current =
    content;

  setUnlockModalOpen(false);

  editor.commands.setContent(
    content,
    false
  );

}, [
  editor,
  note?.id,
  note?.is_locked,
  note?.content,
]);


  /* ========================================================= */
  /* Update Category When Note Changes */
  /* ========================================================= */

useEffect(() => {

  setCategoryId(
    note?.category_id || null
  );

}, [
  note?.id,
  note?.category_id,
]);

  /* ========================================================= */
  /* Loading */
  /* ========================================================= */

  if (!editor) {
    return null;
  }


  /* ========================================================= */
  /* Link Handler */
  /* ========================================================= */

  const setLink = () => {

    const previousUrl =
      editor.getAttributes("link").href;


    const url = window.prompt(
      "Enter URL",
      previousUrl || "https://"
    );


    if (url === null) {
      return;
    }


    if (url === "") {

      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      return;
    }


    editor
      .chain()
      .focus()
      .setLink({
        href: url,
      })
      .run();
  };


  /* ========================================================= */
  /* Image Handler */
  /* ========================================================= */

  const addImage = () => {

    addImageFromFilePicker(
      editor
    );

  };


  /* ========================================================= */
  /* Change Category */
  /* ========================================================= */

  const handleCategoryChange = async (
  newCategory
) => {

  if (
    !newCategory ||
    !note ||
    selectedView === "Trash"
  ) {
    return;
  }

  setCategoryId(
    newCategory.id
  );

  setCategoryOpen(false);

  try {

    await onUpdateNote({

      ...note,

      /*
        Store the category UUID.
      */
      category_id: newCategory.id,

      /*
        Optional display values.
        These can remain in frontend state,
        but category_id is what the database uses.
      */
      label: newCategory.name,

      category: newCategory.name,

    });

  } catch (error) {

    console.error(
      "Failed to update note category:",
      error
    );

    /*
      Restore previous category
      if saving failed.
    */
    setCategoryId(
      note.category_id || null
    );
  }
};


const handleUnlock = async (password) => {
  if (!note || !onUnlockNote) {
    return;
  }

  await onUnlockNote(
    note.id,
    password
  );

  setUnlockModalOpen(false);
};

const isTrashView = selectedView === "Trash";

useEffect(() => {
  if (!editor) {
    return;
  }

  editor.setEditable(selectedView !== "Trash");

}, [editor, selectedView]);
  /* ========================================================= */
  /* Render */
  /* ========================================================= */
if (
  note?.is_locked === true &&
  unlockModalOpen
) {
  return (
    <section
      className="
        relative
        flex
        min-w-0
        flex-1
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/[0.08]
        bg-[#0d1014]
      "
    >

      {/* Locked Editor Area */}

      <div
        className="
          flex
          flex-1
          items-center
          justify-center
        "
      >
        <div
          className="
            text-center
            text-gray-600
          "
        >
          <div
            className="
              mx-auto
              mb-3
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-yellow-500/10
              text-yellow-400
            "
          >
            🔒
          </div>

          <p className="text-sm">
            This note is locked
          </p>
        </div>
      </div>


      {/* Unlock Modal */}

      <UnlockNoteModal
        onClose={() => {
          if (onCancelUnlock) {
            onCancelUnlock();
          }
        }}
        onUnlock={handleUnlock}
      />

    </section>
  );
}
  return (
    <section
      className="
        flex
        min-w-0
        flex-1
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/[0.08]
        bg-[#0d1014]
      "
    >
      

      {/* =================================================== */}
      {/* Editor Header */}
      {/* =================================================== */}

      <EditorHeader
        note={note}

        onTogglePin={() => {
          console.log(
            "Toggle pin"
          );
        }}

        onLock={() => {
          setLockModalOpen(
            true
          );
        }}

        onUpdateNote={
          onUpdateNote
        }
        selectedView={selectedView}
      />


      {/* =================================================== */}
      {/* Category */}
      {/* =================================================== */}

      <div
        className="
          flex
          h-[48px]
          shrink-0
          items-center
          gap-3
          px-5
        "
      >

        {/* ================================================= */}
        {/* Category Dropdown */}
        {/* ================================================= */}

        <div className="relative">

          <button
            type="button"
            disabled={selectedView === "Trash"}
            onClick={() => {
              if (selectedView === "Trash") {
                return;
              }

              setCategoryOpen((open) => !open);
            }}

            className="
              flex
              items-center
              gap-2
              rounded-md
              px-1
              py-1
              text-xs
              transition
              hover:bg-white/[0.04]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            {/* Category Dot */}

            <span
              className={`
                h-2
                w-2
                shrink-0
                rounded-full
                ${selectedCategoryColors.color}
              `}
            />


            {/* Category Name */}

            <span
              className={
                selectedCategoryColors.textColor
              }
            >
              {selectedCategory?.name || "Select Category"}
            </span>


            {/* Arrow */}

            <ChevronDown
              size={13}

              className={`
                text-gray-500
                transition-transform
                ${
                  categoryOpen
                    ? "rotate-180"
                    : ""
                }
              `}
            />

          </button>


          {/* ================================================= */}
          {/* Dropdown Menu */}
          {/* ================================================= */}

          {categoryOpen && (

            <div
              className="
                absolute
                left-0
                top-full
                z-50
                mt-1
                w-[150px]
                overflow-hidden
                rounded-lg
                border
                border-white/[0.08]
                bg-[#11151b]
                p-1
                shadow-xl
              "
            >

              {categories.map(
                (item) => {

                  const itemColors =
                    getCategoryColors(
                      item.color
                    );

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(item)
                      }

                      className={`
                        flex
                        w-full
                        items-center
                        gap-2
                        rounded-md
                        px-3
                        py-2
                        text-left
                        text-xs
                        transition

                        ${
                          categoryId === item.id
                            ? "bg-purple-500/10"
                            : "hover:bg-white/[0.05]"
                        }
                      `}
                    >

                      <span
                        className={`
                          h-2
                          w-2
                          shrink-0
                          rounded-full
                          ${itemColors.color}
                        `}
                      />

                      <span
                        className={`
                          ${
                            categoryId === item.id
                              ? itemColors.textColor
                              : "text-gray-400"
                          }
                        `}
                      >
                        {item.name}
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          )}

        </div>

      </div>


      {/* =================================================== */}
      {/* Toolbar */}
      {/* =================================================== */}

      <EditorToolbar
      editor={editor}
      onSetLink={setLink}
      onAddImage={addImage}
      disabled={selectedView === "Trash"}
    />


      {/* =================================================== */}
      {/* Editor Content */}
      {/* =================================================== */}

      <div
        className="
          editor-scroll
          min-h-0
          flex-1
          overflow-y-auto
        "
      >

        <EditorContent
          editor={editor}
        />

      </div>


      {/* =================================================== */}
      {/* Footer */}
      {/* =================================================== */}

      <div
        className="
          flex
          h-[36px]
          shrink-0
          items-center
          gap-4
          border-t
          border-white/[0.06]
          px-5
        "
      >

        <span
          className="
            text-[10px]
            text-gray-600
          "
        >
          123 words
        </span>


        <span
          className="
            text-[10px]
            text-gray-600
          "
        >
          789 characters
        </span>

      </div>


      {/* =================================================== */}
{/* Lock Modal */}
{/* =================================================== */}

{lockModalOpen && (
  <LockNoteModal
    onClose={() => {
      setLockModalOpen(false);
    }}

    onLock={async (password) => {
      try {
        if (!onUpdateNote || !note) {
          return;
        }

        await onUpdateNote({
          ...note,

          locked: true,

          is_locked: true,

          lock_password: password,
        });

        setLockModalOpen(false);

      } catch (error) {
        console.error(
          "Failed to lock note:",
          error
        );
      }
    }}
  />
)}

    </section>
  );
}