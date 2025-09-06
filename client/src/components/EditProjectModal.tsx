'user client';

import { projectApi } from "@/lib/api";
import { Project } from "@/types";
import React, { useState } from "react";
import { useToast } from "@/contexts/toastContext";



export interface EditProjectModalProps {
    project: Project;
    isOpen: boolean;
    onClose: () => void;
    onProjectUpdated: () => void;
}

export default function EditProjectModal({
    project,
    isOpen,
    onClose,
    onProjectUpdated
}: EditProjectModalProps) {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { success, error: errorToast, loading: toastLoading, dismiss } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Show loading toast
        const loadingToastId = toastLoading("Updating project...");

        try {
            await projectApi.updateProject(project._id, { name, description});

            // Show success toast
            dismiss();
            success("Project updated successfully");

            onProjectUpdated();
            onClose();
        } catch (error: unknown) {
            dismiss();
            errorToast("Failed to update project" + (error instanceof Error ? `: ${error.message}` : ""));
            //setError("Failed to update project" + (error instanceof Error ? `: ${error.message}` : ""));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}