const DataModel = require('./DataModel');
const { v4: uuidv4 } = require('uuid');

class Project extends DataModel {
  constructor() {
    super('projects.json');
  }

  async createProject(projectData) {
    const project = {
      id: uuidv4(),
      name: projectData.name,
      description: projectData.description || '',
      ownerId: projectData.ownerId,
      members: projectData.members || [],
      color: projectData.color || '#3b82f6',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await this.create(project);
  }

  async getProjectsByUser(userId) {
    const projects = await this.readData();
    return projects.filter(project => 
      project.ownerId === userId || project.members.includes(userId)
    );
  }

  async addMember(projectId, userId) {
    const project = await this.findById(projectId);
    if (!project) return null;

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      return await this.update(projectId, { members: project.members });
    }
    return project;
  }

  async removeMember(projectId, userId) {
    const project = await this.findById(projectId);
    if (!project) return null;

    project.members = project.members.filter(id => id !== userId);
    return await this.update(projectId, { members: project.members });
  }

  async updateProject(id, updates) {
    updates.updatedAt = new Date().toISOString();
    return await this.update(id, updates);
  }
}

module.exports = new Project();
