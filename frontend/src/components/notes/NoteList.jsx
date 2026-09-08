import { SlidersHorizontal, ChevronDown } from "lucide-react";
import NoteListItem from "./NoteListItem";

export default function NoteList({
  notes = [],
  selectedNote,
  onSelectNote,
  selectedView = "Notes",
  categories = [],
}) {

  const selectedCategory = categories.find(
  (category) => category.id === selectedView
);

const selectedViewName =
  selectedCategory?.name || selectedView;


  return (
    <section
      className="
        flex
        h-full
        w-[380px]
        shrink-0
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-white/[0.08]
        bg-[#0d1014]
      "
    >

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div
        className="
          flex
          h-[58px]
          shrink-0
          items-center
          justify-between
          border-b
          border-white/[0.06]
          px-4
        "
      >

        {/* =============================================== */}
        {/* All Notes */}
        {/* =============================================== */}

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-white
          "
        >
          {selectedView === "Notes"
          ? "All Notes"
          : selectedViewName}

          <ChevronDown size={15} className="text-gray-500"
          />
        </button>


        {/* =============================================== */}
        {/* Filter */}
        {/* =============================================== */}

        <button
          type="button"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            border
            border-white/[0.08]
            text-gray-500
            transition
            hover:bg-white/[0.05]
            hover:text-gray-300
          "
        >
          <SlidersHorizontal size={15} />
        </button>

      </div>


      {/* ================================================= */
      /* Notes */
      /* ================================================= */}

      <div className=" note-list-scroll min-h-0 flex-1 overflow-y-auto">

        {notes.length === 0 ? (

          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium text-gray-400">
                No notes available
              </p>

              <p className="mt-1 text-xs text-gray-600">
                There are no notes to display here.
              </p>

            </div>
          </div>

        ) : (

          /* =============================================== */
          /* Notes List */
          /* =============================================== */

          [...notes]
            .sort((a, b) => {
              // Pinned notes first
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;

              // Keep original order if both have same pinned status
              return 0;
            })
            .map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                selected={selectedNote?.id === note.id}
                onClick={() => onSelectNote(note)}
              />
            ))

        )}

      </div>


      {/* ================================================= */}
      {/* Footer */}
      {/* ================================================= */}

      <div
        className="
          flex
          h-[38px]
          shrink-0
          items-center
          border-t
          border-white/[0.06]
          px-4
        "
      >

        <span className="text-[11px] text-gray-500">
          {notes.length} notes
        </span>

      </div>

    </section>
  );
}