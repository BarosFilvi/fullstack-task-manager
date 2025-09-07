'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { taskApi } from '@/lib/api';
import { useToast } from '@/contexts/toastContext';
import EditTaskModal from './EditTaskModal';
import ConfirmDialog from './ComfirmDialog';

interface TaskListProps {
  projectId: string;
  onTaskUpdated?: () => void;
  onTaskCountChange?: (count: number, completedCount: number) => void;
  refreshTrigger?: number;
}

export default function TaskList({ projectId, onTaskUpdated, onTaskCountChange, refreshTrigger }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  
  const { success, error: errorToast, loading: toastLoading, dismiss } = useToast();

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, refreshTrigger]);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getTasks(projectId);
      const tasksData = response.data;
      setTasks(tasksData);

      // Calculate completed tasks
      const completedCount = tasksData.filter((task: Task) => task.status === 'done').length;

      // Notify parent about task count change
      if (onTaskCountChange) {
        onTaskCountChange(tasksData.length, completedCount);
      }
    } catch (error: unknown) {
      setError('Failed to load tasks' + (error instanceof Error ? `: ${error.message}` : ""));
      errorToast('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    const loadingToastId = toastLoading('Deleting task...');

    try {
      await taskApi.deleteTask(taskToDelete._id);
      
      dismiss();
      success('Task deleted successfully!');

      // Add error handling here if needed
      try {
        await fetchTasks();
      } catch (fetchError){
        console.error('Error refreshing tasks after deletion:', fetchError);
      }
      
      // Refresh task list
      if (onTaskUpdated) {
        onTaskUpdated();
      }
    } catch (error: unknown) {
      dismiss();
      setError('Failed to load tasks' + (error instanceof Error ? `: ${error.message}` : ""));
      errorToast('Failed to load tasks');
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setIsEditModalOpen(false);
    if (onTaskUpdated) {
      onTaskUpdated();
    }
  };

  if (loading) return (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Tasks</h3>
      
      {tasks.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No tasks yet. Add your first task!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow relative">
              {/* Edit & Delete Buttons */}
              <div className="absolute top-3 right-3 flex space-x-2">
                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(task)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                  title="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(task)}
                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Task Content */}
              <div className="pr-12 mr-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-lg">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.priority}
                  </span>
                  
                  {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                  
                  <span className="text-xs text-gray-400">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Task Modal */}
      {isEditModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete task "${taskToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Delete Task"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}