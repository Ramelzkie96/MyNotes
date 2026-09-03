import { useState } from "react";
import { Eye, EyeOff, Lock, X, ShieldCheck } from "lucide-react";

export default function LockNoteModal({
  onClose,
  onLock,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    onLock(password);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          relative
          w-[440px]
          rounded-2xl
          border
          border-white/[0.10]
          bg-[#11151b]
          p-7
          shadow-2xl
        "
      >

        {/* ========================================= */}
        {/* Close */}
        {/* ========================================= */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-5
            top-5
            text-gray-500
            transition
            hover:text-white
          "
        >
          <X size={20} />
        </button>


        {/* ========================================= */}
        {/* Icon */}
        {/* ========================================= */}

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
            bg-yellow-400/10
          "
        >
          <Lock
            size={30}
            className="text-yellow-400"
          />
        </div>


        {/* ========================================= */}
        {/* Title */}
        {/* ========================================= */}

        <div className="text-center">

          <h2 className="text-xl font-semibold text-white">
            Lock this note
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Set a password to lock this note.
          </p>

        </div>


        {/* ========================================= */}
        {/* Form */}
        {/* ========================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-5"
        >

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-white/[0.10]
                  bg-[#0d1014]
                  px-4
                  pr-12
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-300
                "
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>


          {/* Confirm Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-300">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                className="
                  h-12
                  w-full
                  rounded-lg
                  border
                  border-white/[0.10]
                  bg-[#0d1014]
                  px-4
                  pr-12
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-gray-600
                  focus:border-purple-500
                  focus:ring-1
                  focus:ring-purple-500
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-300
                "
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>


          {/* Error */}

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}


          {/* Security Information */}

          <div
            className="
              flex
              gap-3
              rounded-lg
              bg-purple-500/[0.08]
              p-4
            "
          >

            <ShieldCheck
              size={24}
              className="shrink-0 text-purple-400"
            />

            <p className="text-xs leading-5 text-gray-400">
              Your note will require this password before
              it can be accessed.
            </p>

          </div>


          {/* ========================================= */}
          {/* Buttons */}
          {/* ========================================= */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
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
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-lg
                bg-purple-600
                px-5
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
              Lock Note
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}