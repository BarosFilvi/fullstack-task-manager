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

// Update a task
export const updateTask = async (
  req: AuthenticatedRequest, 
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      { _id: id, owner: req.user!._id },
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    ).populate('project', 'name');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json(task);
  } catch (error: unknown) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
export const deleteTask = async (req: AuthenticatedRequest, res: Response)
: Promise<void> => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOneAndDelete({ 
      _id: id, 
      owner: req.user!._id 
    });
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};

// Get user's tasks statistics
export const getUserTasksStats = async (req: AuthenticatedRequest, res: Response)
: Promise<void> => {
  try {
    const tasks = await Task.find({ owner: req.user!._id });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;

    res.status(200).json({
      todoTasks,
      inProgressTasks,
      completedTasks,
      totalTasks
    });
  } catch (error: unknown) {
    console.error('Get user tasks stats error:', error);
    res.status(500).json({ message: 'Server error fetching tasks statistics' });
  }
}