'use client';

import React, { useState } from 'react';
import { projectApi } from '@/lib/api';
import { useToast } from '@/contexts/toastContext';

interface CreateProjectFormProps {
  onProjectCreated: () => void;
}

export default function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const { success, error: showError, loading: toastLoading, dismiss } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    // Validate form
    if (!name.trim()) {
      setFormError('Project name is required');
      setLoading(false);
      return;
    }

    // Hiển thị toast loading
    const loadingToastId = toastLoading('Creating project...');

    try {
      await projectApi.createProject({ 
        name: name.trim(), 
        description: description.trim() || undefined 
      });
      
      // Ẩn toast loading và hiển thị success
      dismiss();
      success('Project created successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      onProjectCreated();
    } catch (err: unknown) {
      // Ẩn toast loading và hiển thị error
      dismiss();
      setFormError(err instanceof Error ? err.message : "Failed to create project");
      showError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {formError}
          </div>
        )}
        
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
            Project Name *
          </label>
          <input
            id="projectName"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="projectDescription"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project (optional)"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}