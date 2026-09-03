import { useState } from "react";
import { Search, Plus, Sun, Bell, ChevronDown, LogOut, User,} from "lucide-react";
import { useUser, useClerk } from "@clerk/react";

export default function Header() {

  const { user } = useUser();
  const { signOut } = useClerk();

  const [profileOpen, setProfileOpen] = useState(false);


  /* ======================================================= */
  /* USER INFORMATION */
  /* ======================================================= */

  const firstName = user?.firstName || user?.username || "User";

  const fullName = user?.fullName || user?.username || "User";

  const email = user?.primaryEmailAddress?.emailAddress || "";

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
      .toUpperCase() ||
    "U";


  /* ======================================================= */
  /* LOGOUT */
  /* ======================================================= */

const handleLogout = async () => {
  try {
    await signOut({
      redirectUrl: "/sign-in",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <header className="flex h-[72px] items-center justify-between border-b border-white/10 bg-[#0b0d10] px-6">

      {/* ================================================= */}
      {/* Search */}
      {/* ================================================= */}

      <div className="relative w-[360px]">

        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>

        <input type="text" placeholder="Search notes..." className=" h-10 w-full rounded-lg border border-white/10 bg-[#12151a] pl-10 pr-16 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20"/>

        {/* Keyboard shortcut */}

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[11px] text-gray-600">
          <span className="rounded border border-white/10 px-1.5 py-0.5">
            ⌘
          </span>
          <span>K</span>
        </div>
      </div>


      {/* ================================================= */}
      {/* Right actions */}
      {/* ================================================= */}

      <div className="flex items-center gap-4">
        {/* ================================================= */}
        {/* New Note */}
        {/* ================================================= */}

        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(
              new Event("create-new-note")
            );
          }}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-purple-600
            px-4
            py-2.5
            text-sm
            font-medium
            text-white
            shadow-lg
            shadow-purple-600/20
            transition
            hover:bg-purple-500
          "
        >

          <Plus size={18} />

          <span>
            New Note
          </span>

        </button>


        {/* ================================================= */}
        {/* Theme */}
        {/* ================================================= */}

        <button
          type="button"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-gray-400
            transition
            hover:bg-white/5
            hover:text-white
          "
        >

          <Sun size={19} />

        </button>


        {/* ================================================= */}
        {/* Notification */}
        {/* ================================================= */}

        <button
          type="button"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-gray-400
            transition
            hover:bg-white/5
            hover:text-white
          "
        >

          <Bell size={19} />

          <span
            className="
              absolute
              right-1.5
              top-1.5
              h-2
              w-2
              rounded-full
              bg-purple-500
            "
          />

        </button>


        {/* ================================================= */}
        {/* Divider */}
        {/* ================================================= */}

        <div className="h-7 w-px bg-white/10" />


        {/* ================================================= */}
        {/* Profile */}
        {/* ================================================= */}

        <div className="relative">

          <button
            type="button"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            className="
              flex
              items-center
              gap-2.5
              rounded-lg
              px-1.5
              py-1.5
              transition
              hover:bg-white/5
            "
          >

            {/* Avatar */}

            {user?.imageUrl ? (

              <img
                src={user.imageUrl}
                alt={fullName}
                className="
                  h-8
                  w-8
                  rounded-full
                  object-cover
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-600
                  text-xs
                  font-semibold
                  text-white
                "
              >
                {initials}
              </div>

            )}


            {/* Name */}

            <span className="text-sm text-gray-200">
              {firstName}
            </span>


            {/* Arrow */}

            <ChevronDown
              size={15}
              className={`
                text-gray-500
                transition-transform
                ${profileOpen ? "rotate-180" : ""}
              `}
            />

          </button>


          {/* ================================================= */}
          {/* Profile Dropdown */}
          {/* ================================================= */}

          {profileOpen && (

            <div
              className="
                absolute
                right-0
                top-[52px]
                z-50
                w-[280px]
                overflow-hidden
                rounded-xl
                border
                border-white/[0.08]
                bg-[#101318]
                shadow-2xl
                shadow-black/50
              "
            >

              {/* User information */}

              <div
                className="border-b border-white/[0.06] p-4">

                <div className="flex items-center gap-3">

                  {user?.imageUrl ? (

                    <img
                      src={user.imageUrl}
                      alt={fullName}
                      className="
                        h-10
                        w-10
                        rounded-full
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-600
                        text-sm
                        font-semibold
                        text-white
                      "
                    >
                      {initials}
                    </div>

                  )}


                  <div className="min-w-0">

                    <p className="truncate text-sm font-medium text-white">
                      {fullName}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {email}
                    </p>

                  </div>

                </div>

              </div>


              {/* Account */}

              <div className="p-2">

                <button
                  type="button"
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-gray-300
                    transition
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >

                  <User size={16} />

                  Account

                </button>


                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-red-400
                    transition
                    hover:bg-red-500/10
                    hover:text-red-300
                  "
                >

                  <LogOut size={16} />

                  Log out

                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </header>
  );
}