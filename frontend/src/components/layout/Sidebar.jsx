import { useState } from "react";
import {
  FileText,
  Star,
  Pin,
  Trash2,
  Folder,
  Plus,
  X,
} from "lucide-react";

const menuItems = [
  {
    label: "Notes",
    icon: FileText,
  },
  {
    label: "Favorites",
    icon: Star,
  },
  {
    label: "Pinned",
    icon: Pin,
  },
  {
    label: "Trash",
    icon: Trash2,
  },
];

const CATEGORY_COLORS = [
  "blue",
  "purple",
  "pink",
  "yellow",
  "green",
  "orange",
  "red",
  "cyan",
  "indigo",
  "emerald",
];

/* ========================================================= */
/* GET RANDOM UNUSED CATEGORY COLOR */
/* ========================================================= */

const getRandomCategoryColor = (existingCategories) => {
  const usedColors = existingCategories
    .map((category) => category.color)
    .filter(Boolean);

  const availableColors = CATEGORY_COLORS.filter(
    (color) => !usedColors.includes(color)
  );

  /*
    If all colors are already used,
    allow a random color from the full list.
  */

  const colorsToUse =
    availableColors.length > 0
      ? availableColors
      : CATEGORY_COLORS;

  const randomIndex = Math.floor(
    Math.random() * colorsToUse.length
  );

  return colorsToUse[randomIndex];
};

/* ========================================================= */
/* COLOR CLASS */
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

  return colorMap[color] || "bg-purple-500";
};

/* ========================================================= */
/* SIDEBAR */
/* ========================================================= */

export default function Sidebar({
  selectedView,
  onSelectView,

  /*
    Categories should come from the parent/database.

    Example:

    [
      {
        id: "uuid",
        name: "Work",
        color: "blue",
        count: 12
      }
    ]
  */
  categories = [],

  /*
    Parent handles creating the category.
  */
  onCreateCategory,

  /*
    Parent handles deleting the category.
  */
  onDeleteCategory,
}) {
  /* ========================================================= */
  /* NEW CATEGORY STATE */
  /* ========================================================= */

  const [newCategoryName, setNewCategoryName] =
    useState("");

  const [isCreatingCategory, setIsCreatingCategory] =
    useState(false);

  /* ========================================================= */
  /* START NEW CATEGORY */
  /* ========================================================= */

  const handleStartNewCategory = () => {
    setIsCreatingCategory(true);
  };

  /* ========================================================= */
  /* CANCEL NEW CATEGORY */
  /* ========================================================= */

  const handleCancelNewCategory = () => {
    setNewCategoryName("");
    setIsCreatingCategory(false);
  };

  /* ========================================================= */
  /* CREATE CATEGORY */
  /* ========================================================= */

  const handleCreateCategory = async (e) => {
    /*
      Only create when Enter is pressed.
    */

    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();

    const trimmedName = newCategoryName.trim();

    /*
      Don't create an empty category.
    */

    if (!trimmedName) {
      return;
    }

    /*
      Prevent duplicate category names.
    */

    const duplicateCategory = categories.some(
      (category) =>
        category.name?.toLowerCase() ===
        trimmedName.toLowerCase()
    );

    if (duplicateCategory) {
      alert(
        "A category with this name already exists."
      );
      return;
    }

    /*
      Generate a random color that is not
      currently being used.
    */

    const randomColor =
      getRandomCategoryColor(categories);

    try {
      if (onCreateCategory) {
        await onCreateCategory({
          name: trimmedName,
          color: randomColor,
        });
      }

      /*
        Clear input after successful creation.
      */

      setNewCategoryName("");
      setIsCreatingCategory(false);

    } catch (error) {
      console.error(
        "Failed to create category:",
        error
      );
    }
  };

  /* ========================================================= */
  /* DELETE CATEGORY */
  /* ========================================================= */

  const handleDeleteCategory = async (
    e,
    category
  ) => {
    /*
      Prevent the X button from selecting
      the category.
    */

    e.stopPropagation();

    if (!category?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the "${category.name}" category?`
    );

    if (!confirmed) {
      return;
    }

    try {
      if (onDeleteCategory) {
        await onDeleteCategory(category.id);
      }
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error
      );
    }
  };

  /* ========================================================= */
  /* RENDER */
/* ========================================================= */

  return (
    <aside
      className="
        flex h-screen w-[250px] shrink-0 flex-col
        overflow-hidden
        border-r border-white/[0.08]
        bg-[#0b0d10]
        text-white
      "
    >

      {/* ================================================== */}
      {/* LOGO */}
      {/* ================================================== */}

      <div className="flex h-[68px] shrink-0 items-center px-6">

        <div className="flex items-center gap-3">

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              bg-purple-600
              shadow-lg
              shadow-purple-600/20
            "
          >
            <FileText
              size={19}
              strokeWidth={2.3}
              className="text-white"
            />
          </div>

          <span className="text-[17px] font-semibold tracking-tight">
            MyNotes
          </span>

        </div>

      </div>


      {/* ================================================== */}
      {/* SCROLLABLE CONTENT */}
      {/* ================================================== */}

      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-0
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-white/10
          hover:scrollbar-thumb-white/20
        "
      >

        {/* ================================================== */}
        {/* MAIN NAVIGATION */}
        {/* ================================================== */}

        <nav className="px-3">

          <div className="space-y-1">

            {menuItems.map((item) => {

              const Icon = item.icon;

              const active =
                selectedView === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    onSelectView(item.label)
                  }
                  className={`
                    group flex h-[42px] w-full
                    items-center gap-3
                    rounded-lg px-3
                    text-[14px]
                    transition-all duration-150

                    ${
                      active
                        ? "bg-purple-600/20 text-purple-300"
                        : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                    }
                  `}
                >

                  <Icon
                    size={18}
                    strokeWidth={1.8}
                    className={
                      active
                        ? "text-purple-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }
                  />

                  <span>
                    {item.label}
                  </span>

                </button>
              );
            })}

          </div>

        </nav>


        {/* ================================================== */}
        {/* CATEGORIES */}
        {/* ================================================== */}

        <section className="mt-7 px-5">

          <h2
            className="
              mb-3
              text-[11px]
              font-medium
              uppercase
              tracking-[0.08em]
              text-gray-500
            "
          >
            Categories
          </h2>


          <div className="space-y-0.5">

            {categories.map((category) => (

              <div
                key={category.id}
                className="
                  group flex h-[40px] w-full
                  items-center
                  rounded-md
                  text-[14px]
                  text-gray-400
                  transition-colors
                  hover:text-gray-200
                "
              >

                {/* ========================================= */}
                {/* CATEGORY SELECT BUTTON */}
                {/* ========================================= */}

                <button
                  type="button"
                  className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-3
                    rounded-md
                    px-1
                    text-left
                    transition-colors
                    hover:text-gray-200
                  "
                  onClick={() => {
                    onSelectView(category.id);
                  }}
                >

                  {/* Category color */}

                  <span
                    className={`
                      h-2
                      w-2
                      shrink-0
                      rounded-full
                      ${getCategoryColorClass(
                        category.color
                      )}
                    `}
                  />

                  {/* Category name */}

                  <span className="min-w-0 flex-1 truncate">
                    {category.name}
                  </span>

                </button>


                {/* ========================================= */}
                {/* COUNT */}
                {/* ========================================= */}

                <span
                  className="
                    shrink-0
                    text-[12px]
                    text-gray-600
                  "
                >
                  {category.count ?? 0}
                </span>


                {/* ========================================= */}
                {/* DELETE CATEGORY */}
                {/* ========================================= */}

                <button
                  type="button"
                  title={`Delete ${category.name}`}
                  onClick={(e) =>
                    handleDeleteCategory(
                      e,
                      category
                    )
                  }
                  className="
                    ml-1
                    flex
                    h-6
                    w-6
                    shrink-0
                    items-center
                    justify-center
                    rounded
                    text-gray-600
                    opacity-0
                    transition-all
                    group-hover:opacity-100
                    hover:bg-red-500/10
                    hover:text-red-400
                  "
                >
                  <X size={13} />
                </button>

              </div>

            ))}

          </div>


          {/* ================================================== */}
          {/* NEW CATEGORY */}
          {/* ================================================== */}

          {isCreatingCategory ? (

            <div
              className="
                mt-2
                flex
                h-[38px]
                items-center
                gap-2
              "
            >

              <Plus
                size={17}
                strokeWidth={2}
                className="
                  shrink-0
                  text-purple-400
                "
              />

              <input
                autoFocus
                type="text"
                value={newCategoryName}
                onChange={(e) =>
                  setNewCategoryName(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleCreateCategory
                }
                onBlur={() => {
                  /*
                    Close the input if it is empty.
                  */

                  if (
                    !newCategoryName.trim()
                  ) {
                    handleCancelNewCategory();
                  }
                }}
                placeholder="Category name..."
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[14px]
                  text-gray-200
                  outline-none
                  placeholder:text-gray-600
                "
              />

              <button
                type="button"
                title="Cancel"
                onClick={
                  handleCancelNewCategory
                }
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded
                  text-gray-600
                  transition
                  hover:bg-white/[0.05]
                  hover:text-gray-300
                "
              >
                <X size={14} />
              </button>

            </div>

          ) : (

            <button
              type="button"
              onClick={
                handleStartNewCategory
              }
              className="
                mt-2
                flex
                h-[38px]
                items-center
                gap-2
                px-1
                text-[14px]
                text-purple-400
                transition-colors
                hover:text-purple-300
              "
            >

              <Plus
                size={17}
                strokeWidth={2}
              />

              <span>
                New Category
              </span>

            </button>

          )}

        </section>

      </div>

    </aside>
  );
}

