import {
Undo2,
Redo2,
Heading1,
Bold,
Italic,
Underline as UnderlineIcon,
Strikethrough,
List,
ListOrdered,
ListChecks,
Code,
Link as LinkIcon,
Image as ImageIcon,
} from "lucide-react";

import { useRef } from "react";


function ToolbarButton({
  onClick,
  active,
  children,
  title,
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-md
        transition

        ${
          active
            ? "bg-purple-600/20 text-purple-400"
            : "text-gray-500 hover:bg-white/[0.05] hover:text-gray-200"
        }
      `}
    >
      {children}
    </button>
  );
}


/* ========================================================= */
/* Editor Toolbar */
/* ========================================================= */

export default function EditorToolbar({
  editor,
  onSetLink,
  onAddImage,
  disabled = false,
}) {

  /*
    Hidden file input.

    The actual file picker is triggered when
    the Image toolbar button is clicked.
  */
  const imageInputRef = useRef(null);


  /* ========================================================= */
  /* Select Image */
/* ========================================================= */

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };


  /* ========================================================= */
  /* Image Selected */
/* ========================================================= */

  const handleImageSelected = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
      Send the image file to NoteEditor.

      NoteEditor will:
      1. Upload it to Supabase Storage
      2. Get the image URL
      3. Insert the image into TipTap
      4. Save the updated content
    */
    onAddImage?.(file);


    /*
      Reset the input.

      This allows selecting the same image again
      later if needed.
    */
    event.target.value = "";
  };


  return (
    <div
      className="
        mx-5
        flex
        h-[42px]
        shrink-0
        items-center
        gap-1
        overflow-x-auto
        rounded-lg
        border
        border-white/[0.06]
        bg-[#12151a]
        px-2
      "
    >

      {/* ================================================= */}
      {/* Undo */}
      {/* ================================================= */}

      <ToolbarButton
        title="Undo"
        onClick={() =>
          editor
            .chain()
            .focus()
            .undo()
            .run()
        }
      >
        <Undo2 size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Redo */}
      {/* ================================================= */}

      <ToolbarButton
        title="Redo"
        onClick={() =>
          editor
            .chain()
            .focus()
            .redo()
            .run()
        }
      >
        <Redo2 size={16} />
      </ToolbarButton>


      <div
        className="
          mx-1
          h-5
          w-px
          shrink-0
          bg-white/[0.08]
        "
      />


      {/* ================================================= */}
      {/* Heading */}
      {/* ================================================= */}

      <ToolbarButton
        title="Heading"
        active={editor.isActive("heading")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run()
        }
      >
        <Heading1 size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Bold */}
      {/* ================================================= */}

      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        <Bold size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Italic */}
      {/* ================================================= */}

      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        <Italic size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Underline */}
      {/* ================================================= */}

      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Strikethrough */}
      {/* ================================================= */}

      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
      >
        <Strikethrough size={16} />
      </ToolbarButton>


      <div
        className="
          mx-1
          h-5
          w-px
          shrink-0
          bg-white/[0.08]
        "
      />


      {/* ================================================= */}
      {/* Bullet List */}
      {/* ================================================= */}

      <ToolbarButton
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        <List size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Ordered List */}
      {/* ================================================= */}

      <ToolbarButton
        title="Numbered List"
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        <ListOrdered size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Checklist */}
      {/* ================================================= */}

      <ToolbarButton
        title="Checklist"
        active={editor.isActive("taskList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleTaskList()
            .run()
        }
      >
        <ListChecks size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Code Block */}
      {/* ================================================= */}

      <ToolbarButton
        title="Code Block"
        active={editor.isActive("codeBlock")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleCodeBlock()
            .run()
        }
      >
        <Code size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Link */}
      {/* ================================================= */}

      <ToolbarButton
        title="Add Link"
        active={editor.isActive("link")}
        onClick={onSetLink}
      >
        <LinkIcon size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Image */}
      {/* ================================================= */}

      <ToolbarButton
        title="Add Image"
        onClick={handleImageButtonClick}
      >
        <ImageIcon size={16} />
      </ToolbarButton>


      {/* ================================================= */}
      {/* Hidden Image File Input */}
      {/* ================================================= */}

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />

    </div>
  );
}

