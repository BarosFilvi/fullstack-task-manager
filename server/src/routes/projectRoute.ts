import express from "express";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/projectController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// All routers here are protected
router.use(protect);

router.post('/', createProject);
router.get('/', getProjects);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;