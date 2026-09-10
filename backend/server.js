import "dotenv/config";

import express from "express";
import cors from "cors";

import { clerkMiddleware } from "@clerk/express";

import notesRoutes from "./routes/notes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";

const app = express();

/* ========================================================= */
/* CORS */
/* ========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mynotes-ramel.netlify.app",
    ],
    credentials: true,
  })
);

/* ========================================================= */
/* Clerk Middleware */
/* ========================================================= */

app.use(clerkMiddleware());

/* ========================================================= */
/* JSON */
/* ========================================================= */

app.use(express.json());

/* ========================================================= */
/* DEBUG REQUEST LOGGER */
/* ========================================================= */

// app.use((req, res, next) => {
//   console.log(
//     `[REQUEST] ${req.method} ${req.originalUrl}`
//   );

//   next();
// });

/* ========================================================= */
/* Health Check */
/* ========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MyNotes backend is running",
  });
});

/* ========================================================= */
/* Notes Routes */
/* ========================================================= */

app.use(
  "/api/notes",
  notesRoutes
);

/* ========================================================= */
/* Categories Routes */
/* ========================================================= */

app.use(
  "/api/categories",
  categoriesRoutes
);

/* ========================================================= */
/* Server */
/* ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `MyNotes backend running on http://localhost:${PORT}`
  );
});
