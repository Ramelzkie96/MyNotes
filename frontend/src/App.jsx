import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useState } from "react";

import NotesLayout from "./layouts/NotesLayout";
import Notes from "./pages/Notes";

import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";


/* ========================================================= */
/* PROTECTED ROUTE */
/* ========================================================= */

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  /* Clerk is still checking authentication */
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080a0d] text-white">
        <div className="text-sm text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  /* User is NOT authenticated */
  if (!isSignedIn) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }

  /* User is authenticated */
  return children;
}


/* ========================================================= */
/* APP */
/* ========================================================= */

function App() {
  const [selectedView, setSelectedView] = useState("Notes");

  return (
    <Routes>

      {/* ================================================= */}
      {/* SIGN IN */}
      {/* ================================================= */}

      <Route
        path="/sign-in/*"
        element={<SignInPage />}
      />


      {/* ================================================= */}
      {/* SIGN UP */}
      {/* ================================================= */}

      <Route
        path="/sign-up/*"
        element={<SignUpPage />}
      />


      {/* ================================================= */}
      {/* MAIN APPLICATION */}
      {/* ================================================= */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <NotesLayout
              selectedView={selectedView}
              onSelectView={setSelectedView}
            >
              <Notes
                selectedView={selectedView}
              />
            </NotesLayout>
          </ProtectedRoute>
        }
      />


      {/* ================================================= */}
      {/* UNKNOWN ROUTE */}
      {/* ================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;