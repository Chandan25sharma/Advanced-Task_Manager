const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
      tags,
      estimatedTime
    } = req.body;
    const createdBy = req.user.id;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and project ID are required' });
    }

    // Check if user has access to the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && !project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get current tasks to determine position
    const existingTasks = await Task.getTasksByProject(projectId);
    const tasksInStatus = existingTasks.filter(task => task.status === (status || 'todo'));
    const maxPosition = tasksInStatus.length > 0 ? Math.max(...tasksInStatus.map(t => t.position)) : -1;

    const task = await Task.createTask({
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      createdBy,
      dueDate,
      tags,
      estimatedTime,
      position: maxPosition + 1
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let tasks;

    if (projectId) {
      // Check if user has access to the project
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.ownerId !== req.user.id && !project.members.includes(req.user.id)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      tasks = await Task.getTasksByProject(projectId);
    } else {
      tasks = await Task.getTasksByUser(req.user.id);
    }

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && !project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Failed to get task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.updateTask(id, updates);

    res.json({
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, position } = req.body;
    const userId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.updateTaskStatus(id, status, position);

    res.json({
      message: 'Task status updated successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.delete(id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.addComment(id, { userId, text });

    res.json({
      message: 'Comment added successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

const addTimeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, duration, description } = req.body;
    const userId = req.user.id;

    if (!start || !end || !duration) {
      return res.status(400).json({ message: 'Start time, end time, and duration are required' });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user has access to the task's project
    const project = await Project.findById(task.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedTask = await Task.addTimeSession(id, {
      userId,
      start,
      end,
      duration,
      description
    });

    res.json({
      message: 'Time session added successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Add time session error:', error);
    res.status(500).json({ message: 'Failed to add time session' });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  addTimeSession
};
