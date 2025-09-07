import express from 'express';
import { createTask, getTasks, updateTask, deleteTask, getUserTasksStats } from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', createTask);
router.get('/:projectId', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/stats/user', getUserTasksStats);

export default router;