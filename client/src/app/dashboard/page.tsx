'use client';

import React from 'react';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectList from '@/components/ProjectList';
import CreateProjectForm from '@/components/CreateProjectForm';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600">
              Email: {user.email} 
              <span className="text-blue-800"> • Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
            </p>
          </div>

          {/* === PROJECTLIST COMPONENT === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProjectList 
                refreshTrigger={refreshTrigger} 
                onRefresh={handleRefresh}
                onProjectsCountChange={setProjectsCount}
              />
            </div>
            
            <div>
              <CreateProjectForm onProjectCreated={handleRefresh} />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                <p className="text-2xl font-bold text-blue-600">{projectsCount}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                <p className="text-2xl font-bold text-purple-600">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}