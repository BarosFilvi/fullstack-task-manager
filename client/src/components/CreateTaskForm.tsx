'use client';

import React, { useState } from 'react';
import { taskApi } from '@/lib/api';
import { useToast } from '@/contexts/toastContext';

interface CreateTaskFormProps {
  projectId: string;
  onTaskCreated: () => void;
}

export default function CreateTaskForm({ projectId, onTaskCreated }: CreateTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { success, error: showError, loading: toastLoading, dismiss } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Task title is required');
      setLoading(false);
      return;
    }

    const loadingToastId = toastLoading('Creating task...');

    try {
      await taskApi.createTask({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        projectId
      });
      
      dismiss();
      success('Task created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
      
      onTaskCreated();
    } catch (error: unknown) {
      dismiss();
      setError('Failed to create task' + (error instanceof Error ? `: ${error.message}` : ""));
      showError('Failed to create task' + (error instanceof Error ? `: ${error.message}` : ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700">
            Task Title *
          </label>
          <input
            id="taskTitle"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="taskDescription" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="taskDescription"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task (optional)"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="taskStatus"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="taskPriority"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700">
            Due Date (Optional)
          </label>
          <input
            id="taskDueDate"
            type="date"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Task...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}