import express from "express";

import {getNotes,getNote,createNote,updateNote,lockNote,unlockNote,deleteNote,} from "../controllers/notesController.js";

import { requireUser } from "../middleware/auth.js";

const router = express.Router();


/* GET ALL NOTES */
router.get("/",requireUser,getNotes);

/* GET SINGLE NOTE */
router.get("/:id",requireUser,getNote);

/* CREATE NOTE */
router.post("/",requireUser,createNote);

/* UPDATE NOTE */
router.put("/:id",requireUser,updateNote);

/* LOCK NOTE */
router.post("/:id/lock",requireUser,lockNote);

/* UNLOCK NOTE */
router.post("/:id/unlock",requireUser,unlockNote);

/* DELETE NOTE */
router.delete("/:id",requireUser,deleteNote);


export default router;

