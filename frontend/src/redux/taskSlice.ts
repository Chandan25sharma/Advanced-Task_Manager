import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskApi, Task, CreateTaskData, UpdateTaskData, CreateCommentData, CreateTimeSessionData } from '../api/tasks';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ projectId }: { projectId?: string }, { rejectWithValue }) => {
    try {
      const tasks = await taskApi.getAll(projectId);
      return tasks;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTask = createAsyncThunk(
  'tasks/fetchTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const task = await taskApi.getById(id);
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData: CreateTaskData, { rejectWithValue }) => {
    try {
      const response = await taskApi.create(taskData);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, updates }: { id: string; updates: UpdateTaskData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.update(id, updates);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  'tasks/updateTaskStatus',
  async ({ id, status, position }: { id: string; status: 'todo' | 'inprogress' | 'done'; position?: number }, { rejectWithValue }) => {
    try {
      const response = await taskApi.updateStatus(id, status, position);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task status');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskApi.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const addComment = createAsyncThunk(
  'tasks/addComment',
  async ({ id, commentData }: { id: string; commentData: CreateCommentData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addComment(id, commentData);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const addTimeSession = createAsyncThunk(
  'tasks/addTimeSession',
  async ({ id, sessionData }: { id: string; sessionData: CreateTimeSessionData }, { rejectWithValue }) => {
    try {
      const response = await taskApi.addTimeSession(id, sessionData);
      return response.task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add time session');
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
    updateTaskInList: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      if (state.currentTask?.id === action.payload.id) {
        state.currentTask = action.payload;
      }
    },
    addTaskToList: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTaskFromList: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      if (state.currentTask?.id === action.payload) {
        state.currentTask = null;
      }
    },
    reorderTasks: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number; status: string }>) => {
      const { sourceIndex, destinationIndex, status } = action.payload;
      const statusTasks = state.tasks.filter(task => task.status === status);
      const [removed] = statusTasks.splice(sourceIndex, 1);
      statusTasks.splice(destinationIndex, 0, removed);
      
      // Update positions
      statusTasks.forEach((task, index) => {
        task.position = index;
      });
      
      // Update the main tasks array
      state.tasks = state.tasks.filter(task => task.status !== status).concat(statusTasks);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Task
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      // Update Task Status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      // Add Time Session
      .addCase(addTimeSession.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      });
  },
});

export const { 
  clearError, 
  setCurrentTask, 
  updateTaskInList, 
  addTaskToList, 
  removeTaskFromList, 
  reorderTasks 
} = taskSlice.actions;
export default taskSlice.reducer;
