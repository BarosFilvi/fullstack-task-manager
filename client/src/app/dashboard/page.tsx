'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import CreateProjectForm from '@/components/CreateProjectForm';
import TaskList from '@/components/TaskList';
import CreateTaskForm from '@/components/CreateTaskForm';
import { taskApi } from '@/lib/api';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedProjectName, setSelectedProjectName] = useState('');
  const [tasksRefreshTrigger, setTasksRefreshTrigger] = useState(0);
  const [globalTasksCount, setGlobalTasksCount] = useState(0);
  const [globalCompletedTasksCount, setGlobalCompletedTasksCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // fetch global tasks stats when user or tasksRefreshTrigger changes
  useEffect(() => {
    if (user) {
      fetchGlobalTasksStats();
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProjectsCountChange = (count: number) => {
    setProjectsCount(count);
  };

  const handleTasksCountChange = (count: number, completedCount: number = 0) => {
    setTasksCount(count);
    setCompletedTasksCount(completedCount);
  };

  const handleProjectSelect = (projectId: string, projectName: string) => {
    setSelectedProject(projectId);
    setSelectedProjectName(projectName);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setSelectedProjectName('');
  };

  // refresh tasks when a task is created or updated
  const handleTasksRefresh = () => {
    setTasksRefreshTrigger(prev => prev + 1);
  }

  // fetch global tasks stats
  const fetchGlobalTasksStats = async () => {
    try {
      const response = await taskApi.getUserTasksStats();
      setGlobalTasksCount(response.data.totalTasks);
      setGlobalCompletedTasksCount(response.data.completedTasks);
    } catch (error) {
      console.error('Error fetching global tasks stats:', error);
    }
  };

  // Call this to refresh global stats after task updates
  const handleRefreshGlobalStats = () => {
    fetchGlobalTasksStats();
    setTasksRefreshTrigger(prev => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome,
              <span className='text-sky-500'> {user.name}!</span>
            </h1>
            <p className="text-gray-600">
              Email: {user.email}
              <span className='text-sky-600'> • Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {selectedProject ? `Project: ${selectedProjectName}` : 'Dashboard Overview'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                <p className="text-2xl font-bold text-blue-600">{projectsCount}</p>
                <p className="text-sm text-gray-500">Total projects</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">{selectedProject ? 'Project Tasks' : 'Total Tasks'}</h3>
                <p className="text-2xl font-bold text-green-600">{selectedProject ? tasksCount : globalTasksCount}</p>
                <p className="text-sm text-gray-500">{selectedProject ? 'In this project' : 'Across all projects'}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-purple-600">{selectedProject ? completedTasksCount : globalCompletedTasksCount}</p>
                <p className="text-sm text-gray-500">{selectedProject ? 'In this project' : 'Across all projects'}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedProject ? 'Completion Rate' : 'Global Rate'}
                </h3>
                <p className="text-2xl font-bold text-purple-600">
                  {selectedProject 
                    ? `${Math.round((completedTasksCount / (tasksCount || 1)) * 100)}%`
                    : `${Math.round((globalCompletedTasksCount / (globalTasksCount || 1)) * 100)}%`
                  }
                </p>
                <p className="text-sm text-gray-500">Success rate</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {selectedProject ? (
            /* Task View - When a project is selected */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToProjects}
                    className="text-blue-600 hover:text-blue-800 flex items-center cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Projects
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tasks in: {selectedProjectName}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TaskList 
                    projectId={selectedProject}
                    onTaskUpdated={() => {
                      handleRefreshGlobalStats();
                      // You might want to fetch updated counts here
                    }}
                    onTaskCountChange={handleTasksCountChange}
                    refreshTrigger={tasksRefreshTrigger}
                  />
                </div>
                
                <div>
                  <CreateTaskForm 
                    projectId={selectedProject}
                    onTaskCreated={handleRefreshGlobalStats}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Project View - Default view */
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ProjectList 
                    refreshTrigger={refreshTrigger}
                    onRefresh={handleRefresh}
                    onProjectsCountChange={handleProjectsCountChange}
                    onProjectSelect={handleProjectSelect}
                  />
                </div>
                <div>
                  <CreateProjectForm onProjectCreated={handleRefresh} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}