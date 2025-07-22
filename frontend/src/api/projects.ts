import api from './index';
import { User } from './auth';

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: string[];
  color: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  taskStats?: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  memberDetails?: User[];
  ownerDetails?: User;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  color?: string;
  members?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  color?: string;
  status?: string;
}

// Project API functions
export const projectApi = {
  create: async (projectData: CreateProjectData): Promise<{ project: Project; message: string }> => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  getAll: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  update: async (id: string, updates: UpdateProjectData): Promise<{ project: Project; message: string }> => {
    const response = await api.put(`/projects/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (id: string, email: string): Promise<{ project: Project; message: string }> => {
    const response = await api.post(`/projects/${id}/members`, { email });
    return response.data;
  },

  removeMember: async (id: string, memberId: string): Promise<{ project: Project; message: string }> => {
    const response = await api.delete(`/projects/${id}/members/${memberId}`);
    return response.data;
  },
};
