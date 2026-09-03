import { useEffect, useState } from "react";
import {
  Pin,
  Star,
  Share2,
  MoreHorizontal,
  Lock,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";

export default function EditorHeader({
  note,
  onTogglePin,
  onLock,
  onUpdateNote,
  selectedView,
}) {
  /* ========================================================= */
  /* Local Title State */
  /* ========================================================= */

  const [title, setTitle] = useState("");

  /* ========================================================= */
  /* Trash Modal State */
  /* ========================================================= */

  const [trashModalOpen, setTrashModalOpen] = useState(false);
  const [movingToTrash, setMovingToTrash] = useState(false);

  const [restoreSuccessModalOpen, setRestoreSuccessModalOpen] = useState(false);
  const [restoringNote, setRestoringNote] = useState(false);

  const [trashSuccessModalOpen, setTrashSuccessModalOpen] = useState(false);

  /* ========================================================= */
  /* Update Local Title When Selected Note Changes */
  /* ========================================================= */

  useEffect(() => {
    setTitle(note?.title || "");
  }, [note?.id, note?.title]);

  /* ========================================================= */
  /* Title Change */
  /* ========================================================= */

const handleTitleChange = (e) => {
  if (selectedView === "Trash") {
    return;
  }

  setTitle(e.target.value);
};

  /* ========================================================= */
  /* Save Title When Input Loses Focus */
  /* ========================================================= */

const handleTitleBlur = async () => {
  if (!note || selectedView === "Trash") {
    return;
  }

  if (title === (note.title || "")) {
    return;
  }

  await onUpdateNote({
    ...note,
    title: title,
  });
};

  /* ========================================================= */
  /* Toggle Favorite */
  /* ========================================================= */

  const handleToggleFavorite = async () => {
    if (!note) return;

    const newFavoriteValue = !note.starred;

    await onUpdateNote({
      ...note,

      // Frontend field
      starred: newFavoriteValue,

      // Database field
      is_favorite: newFavoriteValue,
    });
  };

  /* ========================================================= */
  /* Toggle Pin */
  /* ========================================================= */

  const handleTogglePin = async () => {
    if (!note) return;

    const newPinnedValue = !note.pinned;

    await onUpdateNote({
      ...note,

      // Frontend field
      pinned: newPinnedValue,

      // Database field
      is_pinned: newPinnedValue,
    });
  };

  /* ========================================================= */
  /* Open Trash Confirmation Modal */
  /* ========================================================= */

  const handleOpenTrashModal = () => {
    if (!note || movingToTrash) {
      return;
    }

    setTrashModalOpen(true);
  };

  /* ========================================================= */
  /* Move Note To Trash */
  /* ========================================================= */

  const handleMoveToTrash = async () => {
  if (!note || movingToTrash) {
    return;
  }

  try {
    setMovingToTrash(true);

    await onUpdateNote({
      ...note,

      // Frontend field
      deleted: true,

      // Database field
      is_deleted: true,
    });

    setTrashModalOpen(false);

    /* ----------------------------------------------- */
    /* Move to Trash succeeded */
    /* ----------------------------------------------- */

    setTrashSuccessModalOpen(true);

  } catch (error) {
    console.error(
      "Failed to move note to trash:",
      error
    );
  } finally {
    setMovingToTrash(false);
  }
};

  /* ========================================================= */
  /* Close Trash Modal */
  /* ========================================================= */

  const handleCloseTrashModal = () => {
    if (movingToTrash) {
      return;
    }

    setTrashModalOpen(false);
  };

/* ========================================================= */
/* Restore Note From Trash */
/* ========================================================= */

const handleRestoreNote = async () => {
  if (!note || restoringNote) {
    return;
  }

  try {
    setRestoringNote(true);

    await onUpdateNote({
      ...note,

      // Frontend field
      deleted: false,

      // Database field
      is_deleted: false,
    });

    /* ----------------------------------------------- */
    /* Restore succeeded */
    /* ----------------------------------------------- */

    setRestoreSuccessModalOpen(true);

  } catch (error) {
    console.error(
      "Failed to restore note:",
      error
    );
  } finally {
    setRestoringNote(false);
  }
};

  /* ========================================================= */
  /* Render */
  /* ========================================================= */

  return (
    <div className="relative flex h-[58px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5">

      {/* ================================================= */}
      {/* Left Side */}
      {/* ================================================= */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Title Input */}

        <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        onBlur={handleTitleBlur}
        placeholder="Untitled Note"
        disabled={selectedView === "Trash"}
        className={`
          w-full
          max-w-[400px]
          min-w-[150px]
          bg-transparent
          text-[18px]
          font-semibold
          text-white
          outline-none
          placeholder:text-gray-500

          ${
            selectedView === "Trash"
              ? "cursor-not-allowed text-gray-500"
              : "cursor-text"
          }
        `}
      />

      </div>


      {/* ================================================= */
      /* Right Side */
      /* ================================================= */}

      <div className="flex items-center gap-4">

        {/* ================================================= */}
        {/* Edited */}
        {/* ================================================= */}

        <span className="text-[11px] text-gray-500">
          {note?.updated_at
            ? `Edited ${new Date(
                note.updated_at
              ).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}`
            : ""}
        </span>


        {/* ================================================= */}
        {/* TRASH VIEW */
      /* ================================================= */}

        {selectedView === "Trash" ? (

        <button
          type="button"
          title="Restore Note"
          onClick={handleRestoreNote}
          disabled={restoringNote}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-green-500/20
            bg-green-500/10
            px-4
            py-2
            text-sm
            font-medium
            text-green-400
            transition
            hover:bg-green-500/20
            hover:text-green-300
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RotateCcw
            size={16}
            className={restoringNote ? "animate-spin" : ""}
          />

          {restoringNote
            ? "Restoring..."
            : "Restore Note"}
        </button>

        ) : (

          /* ================================================= */
          /* NORMAL NOTE VIEW */
          /* ================================================= */

          <>

            {/* ================================================= */}
            {/* Favorite */}
            {/* ================================================= */}

            <button
              type="button"
              title={
                note?.starred
                  ? "Remove from Favorites"
                  : "Add to Favorites"
              }
              onClick={handleToggleFavorite}
              className={`
                transition
                ${
                  note?.starred
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-yellow-400"
                }
              `}
            >
              <Star
                size={17}
                className={
                  note?.starred
                    ? "fill-current"
                    : ""
                }
              />
            </button>


            {/* ================================================= */}
            {/* Pin */}
            {/* ================================================= */}

            <button
              type="button"
              title={
                note?.pinned
                  ? "Unpin"
                  : "Pin"
              }
              onClick={handleTogglePin}
              className={`
                transition
                ${
                  note?.pinned
                    ? "text-purple-400"
                    : "text-gray-500 hover:text-purple-400"
                }
              `}
            >
              <Pin
                size={17}
                className={
                  note?.pinned
                    ? "fill-current"
                    : ""
                }
              />
            </button>


            {/* ================================================= */}
            {/* Lock */}
            {/* ================================================= */}
            <button
              type="button"
              title={
                note?.locked
                  ? "Unlock"
                  : "Lock"
              }
              onClick={onLock}
              className={`
                transition
                ${
                  note?.locked
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-yellow-400"
                }
              `}
            >
              <Lock size={17} />
            </button>

            {/* ================================================= */}
            {/* Trash */}
            {/* ================================================= */}

            <button
              type="button"
              title="Move to Trash"
              onClick={handleOpenTrashModal}
              disabled={movingToTrash}
              className="
                text-gray-500
                transition
                hover:text-red-400
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Trash2 size={17} />
            </button>


            {/* ================================================= */}
            {/* Share */}
            {/* ================================================= */}

            {/* <button
              type="button"
              title="Share"
              className="
                text-gray-500
                transition
                hover:text-white
              "
            >
              <Share2 size={17} />
            </button> */}


            {/* ================================================= */}
            {/* More */}
            {/* ================================================= */}
{/* 
            <button
              type="button"
              title="More"
              className="
                text-gray-500
                transition
                hover:text-white
              "
            >
              <MoreHorizontal size={18} />
            </button> */}

          </>

        )}

      </div>


      {/* ========================================================= */}
      {/* Move To Trash Confirmation Modal */}
      {/* ========================================================= */}

      {trashModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !movingToTrash
            ) {
              handleCloseTrashModal();
            }
          }}
        >

          {/* ================================================= */}
          {/* Modal */}
          {/* ================================================= */}

          <div
            className="
              relative
              w-full
              max-w-[440px]
              rounded-2xl
              border
              border-white/[0.10]
              bg-[#11151b]
              p-7
              shadow-2xl
            "
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >

            {/* ================================================= */}
            {/* Close */}
            {/* ================================================= */}

            <button
              type="button"
              disabled={movingToTrash}
              onClick={handleCloseTrashModal}
              className="
                absolute
                right-5
                top-5
                text-gray-500
                transition
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              title="Close"
            >
              <X size={20} />
            </button>


            {/* ================================================= */}
            {/* Icon */}
            {/* ================================================= */}

            <div
              className="
                mx-auto
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-red-500/10
              "
            >
              <Trash2
                size={30}
                className="text-red-400"
              />
            </div>


            {/* ================================================= */}
            {/* Title */}
            {/* ================================================= */}

            <div className="text-center">

              <h2 className="text-xl font-semibold text-white">
                Move note to Trash?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Are you sure you want to move{" "}
                <span className="font-medium text-gray-200">
                  "{note?.title || "Untitled Note"}"
                </span>{" "}
                to Trash?
              </p>

            </div>


            {/* ================================================= */}
            {/* Warning */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                rounded-lg
                border
                border-red-500/10
                bg-red-500/[0.06]
                p-4
              "
            >

              <div className="flex gap-3">

                <Trash2
                  size={20}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-400
                  "
                />

                <div>

                  <p className="text-sm font-medium text-red-300">
                    This note will be moved to Trash
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-400">
                    You can restore this note from the
                    Trash section.
                    If you do not restore it within
                    7 days, it will be permanently deleted.
                  </p>

                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* Buttons */}
            {/* ================================================= */}

            <div
              className="
                mt-6
                flex
                justify-end
                gap-3
              "
            >

              {/* Cancel */}

              <button
                type="button"
                disabled={movingToTrash}
                onClick={handleCloseTrashModal}
                className="
                  rounded-lg
                  border
                  border-white/[0.10]
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-300
                  transition
                  hover:bg-white/[0.05]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>


              {/* Move To Trash */}

              <button
                type="button"
                disabled={movingToTrash}
                onClick={handleMoveToTrash}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-red-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  shadow-lg
                  shadow-red-600/20
                  transition
                  hover:bg-red-500
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >

                <Trash2 size={16} />

                {movingToTrash
                  ? "Moving..."
                  : "Move to Trash"}

              </button>

            </div>

          </div>

        </div>
      )}


      {/* ========================================================= */
/* Move To Trash Success Modal */
/* ========================================================= */}

{trashSuccessModalOpen && (
  <div
    className="
      fixed
      inset-0
      z-[110]
      flex
      items-center
      justify-center
      bg-black/60
      p-4
      backdrop-blur-sm
    "
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        setTrashSuccessModalOpen(false);
      }
    }}
  >

    <div
      className="
        relative
        w-full
        max-w-[420px]
        rounded-2xl
        border
        border-white/[0.10]
        bg-[#11151b]
        p-7
        shadow-2xl
      "
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >

      {/* ================================================= */}
      {/* Success Icon */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-red-500/10
        "
      >
        <Trash2
          size={30}
          className="text-red-400"
        />
      </div>


      {/* ================================================= */}
      {/* Title */}
      {/* ================================================= */}

      <div className="text-center">

        <h2 className="text-xl font-semibold text-white">
          Note Moved to Trash
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          <span className="font-medium text-gray-200">
            "{note?.title || "Untitled Note"}"
          </span>{" "}
          has been successfully moved to Trash.
        </p>

      </div>


      {/* ================================================= */}
      {/* Information */}
      {/* ================================================= */}

      <div
        className="
          mt-6
          rounded-lg
          border
          border-red-500/10
          bg-red-500/[0.06]
          p-4
        "
      >

        <div className="flex gap-3">

          <Trash2
            size={20}
            className="
              mt-0.5
              shrink-0
              text-red-400
            "
          />

          <p className="text-xs leading-5 text-gray-400">
            This note is now in your Trash section.
            You can restore it at any time.
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* Button */}
      {/* ================================================= */}

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={() =>
            setTrashSuccessModalOpen(false)
          }
          className="
            rounded-lg
            bg-red-600
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-lg
            shadow-red-600/20
            transition
            hover:bg-red-500
          "
        >
          Done
        </button>

      </div>

    </div>

  </div>
)}


      {/* ========================================================= */
/* Restore Success Modal */
/* ========================================================= */}

{restoreSuccessModalOpen && (
  <div
    className="
      fixed
      inset-0
      z-[110]
      flex
      items-center
      justify-center
      bg-black/60
      p-4
      backdrop-blur-sm
    "
    onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        setRestoreSuccessModalOpen(false);
      }
    }}
  >

    <div
      className="
        relative
        w-full
        max-w-[420px]
        rounded-2xl
        border
        border-white/[0.10]
        bg-[#11151b]
        p-7
        shadow-2xl
      "
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >

      {/* ================================================= */}
      {/* Success Icon */}
      {/* ================================================= */}

      <div
        className="
          mx-auto
          mb-5
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-green-500/10
        "
      >
        <RotateCcw
          size={30}
          className="text-green-400"
        />
      </div>


      {/* ================================================= */}
      {/* Title */}
      {/* ================================================= */}

      <div className="text-center">

        <h2 className="text-xl font-semibold text-white">
          Note Restored
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          <span className="font-medium text-gray-200">
            "{note?.title || "Untitled Note"}"
          </span>{" "}
          has been successfully restored.
        </p>

      </div>


      {/* ================================================= */}
      {/* Information */}
      {/* ================================================= */}

      <div
        className="
          mt-6
          rounded-lg
          border
          border-green-500/10
          bg-green-500/[0.06]
          p-4
        "
      >

        <div className="flex gap-3">

          <RotateCcw
            size={20}
            className="
              mt-0.5
              shrink-0
              text-green-400
            "
          />

          <p className="text-xs leading-5 text-gray-400">
            This note has been moved back to your
            Notes section.
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* Button */}
      {/* ================================================= */}

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={() =>
            setRestoreSuccessModalOpen(false)
          }
          className="
            rounded-lg
            bg-green-600
            px-5
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-lg
            shadow-green-600/20
            transition
            hover:bg-green-500
          "
        >
          Done
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}