import express from 'express';
import { createTask, getTasks } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createTask);
router.get('/:projectId', getTasks);

export default router;