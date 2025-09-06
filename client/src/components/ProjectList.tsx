'use client';

import { useEffect, useState } from "react";
import { projectApi } from "@/lib/api";
import { Project } from "@/types";
import { useToast } from "@/contexts/toastContext";
import EditProjectModal from "./EditProjectModal";
import ConfirmDialog from "./ComfirmDialog";

export interface ProjectListProps {
    refreshTrigger: number;
    onRefresh: () => void;
    onProjectsCountChange?: (count: number) => void;
}

export default function ProjectList({ refreshTrigger, onRefresh, onProjectsCountChange }: ProjectListProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // <-- Thêm state
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null); // <-- Thêm state
    const { success, error: errorToast, loading: toastLoading, dismiss } = useToast();

    useEffect(() => {
        fetchProjects();
    }, [refreshTrigger]);

    const fetchProjects = async () => {
        try {
            const response = await projectApi.getProjects();
            setProjects(response.data);

            // Notify parent about project count change
            if (onProjectsCountChange) {
                onProjectsCountChange(response.data.length);
            }
        } catch (error: unknown) {
            setError('Failed to load projects' + (error instanceof Error ? `: ${error.message}` : ""));
        } finally {
            setLoading(false);
        }
    };

    // Handle edit
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsEditModalOpen(true);
    };

    // Handle delete click - mở dialog
    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setIsDeleteDialogOpen(true);
    };

    // Handle delete confirm - khi người dùng xác nhận xóa
    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;

        // Show loading toast
        const loadingToastId = toastLoading("Deleting project...");

        try {
            await projectApi.deleteProject(projectToDelete._id);
            // Show success toast
            dismiss();
            success("Project deleted successfully");
            onRefresh(); // Refresh project list
        } catch (error: unknown) {
            dismiss();
            errorToast("Failed to delete project" + (error instanceof Error ? `: ${error.message}` : ""));
        } finally {
            // Đóng dialog và reset state
            setIsDeleteDialogOpen(false);
            setProjectToDelete(null);
        }
    };

    // Handle delete cancel - khi người dùng hủy
    const handleDeleteCancel = () => {
        setIsDeleteDialogOpen(false);
        setProjectToDelete(null);
    };

    // Handle project updated
    const handleProjectUpdated = () => {
        onRefresh();
        setIsEditModalOpen(false);
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            {projects.length === 0 ? (
            <p className="text-gray-600">No projects yet. Create your first project!</p>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                <div key={project._id} className="bg-white p-6 rounded-lg shadow relative">
                    {/* Buttons container */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                    {/* Edit Button */}
                    <button
                        onClick={() => handleEdit(project)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="Edit project"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => handleDeleteClick(project)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                        title="Delete project"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    </div>

                    {/* Project content */}
                    <div className="pr-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{project.name}</h3>
                    {project.description && (
                        <p className="text-gray-600 text-sm">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-4">
                        Created: {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                    </div>
                </div>
                ))}
            </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editingProject && (
            <EditProjectModal
                project={editingProject}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onProjectUpdated={handleProjectUpdated}
            />
            )}

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                title="Delete Project"
                message={`Are you sure you want to delete project "${projectToDelete?.name}"? All tasks in this project will also be permanently deleted. This action cannot be undone.`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText="Delete Project"
                cancelText="Cancel"
                isDestructive={true}
            />
        </div>
    );
}