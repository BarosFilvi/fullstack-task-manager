import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Project, { IProject } from "../models/Project";

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
}