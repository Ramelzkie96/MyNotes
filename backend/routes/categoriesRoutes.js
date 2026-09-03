import express from "express";

import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

import { requireUser } from "../middleware/auth.js";

const router = express.Router();


/* ========================================================= */
/* GET ALL CATEGORIES */
/* ========================================================= */

router.get(
  "/",
  requireUser,
  getCategories
);


/* ========================================================= */
/* CREATE CATEGORY */
/* ========================================================= */

router.post(
  "/",
  requireUser,
  createCategory
);


/* ========================================================= */
/* DELETE CATEGORY */
/* ========================================================= */

router.delete(
  "/:id",
  requireUser,
  deleteCategory
);


export default router;
