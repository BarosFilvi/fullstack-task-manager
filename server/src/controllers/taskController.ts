import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Task, { ITask } from '../models/Task';
import Project from '../models/Project';

// Create a new task
export const createTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description, status, priority, dueDate, projectId } = req.body;

    if (!title) {
      res.status(400).json({ message: 'Task title is required' });
      return;
    }

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, owner: req.user!._id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const task: ITask = new Task({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate,
      project: projectId,
      owner: req.user!._id
    });

    await task.save();
    res.status(201).json(task);
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Get all tasks for a project
export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;

    // Verify project belongs to user
    const project = await Project.findOne({ _id: projectId, owner: req.user!._id });
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const tasks = await Task.find({ project: projectId, owner: req.user!._id })
      .sort({ createdAt: -1 })
      .populate('project', 'name'); // Populate project name

    res.status(200).json(tasks);
  } catch (error: any) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error fetching tasks' });
  }
};