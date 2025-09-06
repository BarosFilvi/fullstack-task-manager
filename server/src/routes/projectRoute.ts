import express from "express";
import { createProject, getProjects } from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routers here are protected
router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);

export default router;