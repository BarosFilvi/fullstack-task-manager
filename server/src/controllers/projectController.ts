import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Project, { IProject } from "../models/Project";
import Task from "../models/Task";

// Create a new project
export const createProject = async (
    req: AuthenticatedRequest, res: Response
): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!name) {
            res.status(400).json({ message: "Project name is required" });
            return;
        }

        const project: IProject = new Project({
            name,
            description,
            owner: req.user!._id
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all projects for the authenticated user
export const getProjects = async (
    req: AuthenticatedRequest, res: Response
): Promise<void> => {
    try {
        const projects = await Project.find({ owner: req.user!._id }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error: any) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a project by ID
export const updateProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findOneAndUpdate(
            { _id: id, owner: req.user!._id },
            { name, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        res.status(200).json(project);
    } catch (error: unknown) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a project by ID
export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const project = await Project.findOneAndDelete({
            _id: id,
            owner: req.user!._id
        });

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Delete all tasks associated with this project
        await Task.deleteMany({ project: id });
        res.status(200).json({ message: "Project and associated tasks deleted" });
    } catch (error: unknown) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Server error deleting project" });
    }
};