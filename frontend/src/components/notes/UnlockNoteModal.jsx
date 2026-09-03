import { useState } from "react";
import { LockKeyhole, X, Eye, EyeOff } from "lucide-react";

export default function UnlockNoteModal({
  onClose,
  onUnlock,
}) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const handleSubmit = async (event) => {
  event.preventDefault();

  console.log("UNLOCK BUTTON CLICKED");
  console.log("Password:", password);

  if (!password.trim()) {
    console.log("Password is empty");
    setError("Please enter the password.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    console.log("Calling onUnlock...");

    await onUnlock(password);

    console.log("onUnlock completed successfully");

  } catch (error) {
    console.error("Unlock modal error:", error);

    setError(
      error.message ||
      "Incorrect password."
    );
  } finally {
    setLoading(false);
  }
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
        bg-black/70
        backdrop-blur-sm
      "
    >

      <div
        className="
          relative
          w-[380px]
          rounded-xl
          border
          border-white/[0.08]
          bg-[#11151b]
          p-6
          shadow-2xl
        "
      >

        {/* Close */}

        <button
          type="submit"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            rounded-md
            p-1
            text-gray-500
            transition
            hover:bg-white/[0.05]
            hover:text-gray-300
          "
        >
          <X size={18} />
        </button>


        {/* Icon */}

        <div
          className="
            mx-auto
            mb-4
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
          <LockKeyhole size={22} />
        </div>


        {/* Title */}

        <h2
          className="
            text-center
            text-lg
            font-semibold
            text-white
          "
        >
          Note Locked
        </h2>


        {/* Description */}

        <p
          className="
            mt-2
            text-center
            text-sm
            text-gray-500
          "
        >
          Enter your password to open this note.
        </p>


        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          <label
            className="
              mb-2
              block
              text-xs
              font-medium
              text-gray-400
            "
          >
            Password
          </label>


          <div className="relative">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              autoFocus
              disabled={loading}
              className="
                w-full
                rounded-lg
                border
                border-white/[0.08]
                bg-[#0d1014]
                px-3
                py-2.5
                pr-10
                text-sm
                text-white
                outline-none
                placeholder:text-gray-600
                focus:border-purple-500/50
              "
            />


            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
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
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>


          {/* Error */}

          {error && (
            <p
              className="
                mt-2
                text-xs
                text-red-400
              "
            >
              {error}
            </p>
          )}


          {/* Buttons */}

          <div
            className="
              mt-5
              flex
              gap-2
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1
                rounded-lg
                border
                border-white/[0.08]
                px-4
                py-2.5
                text-sm
                text-gray-400
                transition
                hover:bg-white/[0.04]
                hover:text-white
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                loading ||
                !password.trim()
              }
              className="
                flex-1
                rounded-lg
                bg-purple-600
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-purple-500
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {loading
                ? "Unlocking..."
                : "Unlock Note"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}