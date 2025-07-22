const DataModel = require('./DataModel');
const { v4: uuidv4 } = require('uuid');

class Task extends DataModel {
  constructor() {
    super('tasks.json');
  }

  async createTask(taskData) {
    const task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      projectId: taskData.projectId,
      assignedTo: taskData.assignedTo || null,
      createdBy: taskData.createdBy,
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      attachments: taskData.attachments || [],
      comments: [],
      timeTracking: {
        estimated: taskData.estimatedTime || 0,
        actual: 0,
        sessions: []
      },
      position: taskData.position || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await this.create(task);
  }

  async getTasksByProject(projectId) {
    return await this.findAll({ projectId });
  }

  async getTasksByUser(userId) {
    const tasks = await this.readData();
    return tasks.filter(task => 
      task.assignedTo === userId || task.createdBy === userId
    );
  }

  async updateTaskStatus(id, status, position) {
    const updates = { 
      status, 
      updatedAt: new Date().toISOString() 
    };
    
    if (position !== undefined) {
      updates.position = position;
    }
    
    return await this.update(id, updates);
  }

  async addComment(taskId, comment) {
    const task = await this.findById(taskId);
    if (!task) return null;

    const newComment = {
      id: uuidv4(),
      userId: comment.userId,
      text: comment.text,
      createdAt: new Date().toISOString()
    };

    task.comments.push(newComment);
    return await this.update(taskId, { comments: task.comments });
  }

  async addTimeSession(taskId, session) {
    const task = await this.findById(taskId);
    if (!task) return null;

    const newSession = {
      id: uuidv4(),
      userId: session.userId,
      start: session.start,
      end: session.end,
      duration: session.duration,
      description: session.description || '',
      createdAt: new Date().toISOString()
    };

    task.timeTracking.sessions.push(newSession);
    task.timeTracking.actual += session.duration;
    
    return await this.update(taskId, { timeTracking: task.timeTracking });
  }

  async updateTask(id, updates) {
    updates.updatedAt = new Date().toISOString();
    return await this.update(id, updates);
  }
}

module.exports = new Task();
