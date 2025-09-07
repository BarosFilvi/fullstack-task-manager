import axios from "axios";

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth API calls
export const authApi = {
    login: (email: string, password: string) => 
        api.post('/auth/login', {email, password}),

    register: (name: string, email: string, password: string) => 
        api.post('/auth/register', {name, email, password}),

    getMe: () => api.get('/auth/me'),
};

// Project API calls
export const projectApi = {
    getProjects: () => 
        api.get('/projects'),
    createProject: (data: {name: string, description?: string}) => 
        api.post('/projects', data),
    updateProject: (id: string, data: {name: string; description?: string}) =>
        api.put(`/projects/${id}`, data),
    deleteProject: (id: string) => 
        api.delete(`/projects/${id}`),
};

// Task API calls
export const taskApi = {
    getTasks: (projectId: string) =>
        api.get(`/tasks/${projectId}`),
    createTask: (data: {
        title: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
        projectId: string;
    }) => api.post('/tasks', data),
    updateTask: (
        id: string,
        data: {
            title?: string;
            description?: string;
            status?: string;
            priority?: string;
            dueDate?: string;
            projectId?: string;
        }
    ) => 
        api.put(`/tasks/${id}`, data),
    deleteTask: (id: string) =>
        api.delete(`/tasks/${id}`),
    getUserTasksStats: () =>
        api.get('/tasks/stats/user'),
};