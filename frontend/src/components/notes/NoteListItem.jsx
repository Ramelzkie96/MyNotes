import {
  Lock,
  Pin,
  Star,
} from "lucide-react";

export default function NoteListItem({
  note,
  selected,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full border-b border-white/[0.06] px-4 py-3 text-left transition-colors
        ${
          selected
            ? "bg-purple-600/20"
            : "hover:bg-white/[0.03]"
        }
      `}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0 flex-1">

          {/* Title */}
          <div className="flex items-center gap-2">

            {/* Category dot */}
            {note.color && (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${note.color}`}
              />
            )}

            <h3
              className={`
                truncate
                text-[13px]
                font-medium
                ${
                  selected
                    ? "text-white"
                    : "text-gray-200"
                }
              `}
            >
              {note.title}
            </h3>

          </div>

          {/* Preview */}
          <p className="mt-1 truncate text-[11px] text-gray-500">
            {note.preview}
          </p>

        </div>

        {/* Lock / Pin / Star */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Lock */}
          {note.locked && (
            <Lock
              size={14}
              className="text-yellow-400"
            />
          )}

          {/* Star */}
          {note.starred && (
            <Star
              size={14}
              fill="currentColor"
              className="text-yellow-400"
            />
          )}

          {/* Pin */}
          {note.pinned && (
            <Pin
              size={14}
              className="text-purple-400"
            />
          )}

        </div>

      </div>

      {/* Bottom row */}
      <div className="mt-2 flex items-center justify-between">

        <div className="flex items-center gap-2">

          {/* Label */}
          {note.label && (
            <span className="text-[10px] text-gray-500">
              {note.label}
            </span>
          )}

        </div>

        {/* Date */}
        <span className="text-[10px] text-gray-600">
          {note.date}
        </span>

      </div>

    </button>
  );
}