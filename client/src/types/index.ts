export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    owner: string; // userId
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    projectId: string; // projectId
    assignee: string; // userId
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}