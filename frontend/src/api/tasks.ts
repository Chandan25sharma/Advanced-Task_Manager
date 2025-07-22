import api from './index';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  priority: 'low' | 'medium' | 'high';
  projectId: string;
  assignedTo?: string;
  createdBy: string;
  dueDate?: string;
  tags: string[];
  attachments: string[];
  comments: Comment[];
  timeTracking: {
    estimated: number;
    actual: number;
    sessions: TimeSession[];
  };
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface TimeSession {
  id: string;
  userId: string;
  start: string;
  end: string;
  duration: number;
  description: string;
  createdAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'inprogress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  projectId: string;
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  estimatedTime?: number;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'inprogress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  assignedTo?: string;
  dueDate?: string;
  tags?: string[];
  position?: number;
}

export interface CreateCommentData {
  text: string;
}

export interface CreateTimeSessionData {
  start: string;
  end: string;
  duration: number;
  description?: string;
}

// Task API functions
export const taskApi = {
  create: async (taskData: CreateTaskData): Promise<{ task: Task; message: string }> => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  getAll: async (projectId?: string): Promise<Task[]> => {
    const response = await api.get('/tasks', {
      params: projectId ? { projectId } : undefined,
    });
    return response.data;
  },

  getById: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  update: async (id: string, updates: UpdateTaskData): Promise<{ task: Task; message: string }> => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: 'todo' | 'inprogress' | 'done',
    position?: number
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.put(`/tasks/${id}/status`, { status, position });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  addComment: async (id: string, commentData: CreateCommentData): Promise<{ task: Task; message: string }> => {
    const response = await api.post(`/tasks/${id}/comments`, commentData);
    return response.data;
  },

  addTimeSession: async (
    id: string,
    sessionData: CreateTimeSessionData
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.post(`/tasks/${id}/time`, sessionData);
    return response.data;
  },
};
