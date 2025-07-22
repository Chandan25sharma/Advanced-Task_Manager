const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { name, description, color, members } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const project = await Project.createProject({
      name,
      description,
      color,
      ownerId,
      members: members || []
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.getProjectsByUser(userId);

    // Get project details with member information
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.getTasksByProject(project.id);
        const taskStats = {
          total: tasks.length,
          todo: tasks.filter(t => t.status === 'todo').length,
          inProgress: tasks.filter(t => t.status === 'inprogress').length,
          done: tasks.filter(t => t.status === 'done').length
        };

        // Get member details
        const memberDetails = await Promise.all(
          project.members.map(async (memberId) => {
            const member = await User.findById(memberId);
            return member ? {
              id: member.id,
              username: member.username,
              email: member.email,
              avatar: member.avatar
            } : null;
          })
        );

        return {
          ...project,
          taskStats,
          memberDetails: memberDetails.filter(Boolean)
        };
      })
    );

    res.json(projectsWithDetails);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Failed to get projects' });
  }
};

const getProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user has access to project
    if (project.ownerId !== userId && !project.members.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get tasks for this project
    const tasks = await Task.getTasksByProject(id);

    // Get member details
    const memberDetails = await Promise.all(
      project.members.map(async (memberId) => {
        const member = await User.findById(memberId);
        return member ? {
          id: member.id,
          username: member.username,
          email: member.email,
          avatar: member.avatar
        } : null;
      })
    );

    // Get owner details
    const owner = await User.findById(project.ownerId);
    const ownerDetails = owner ? {
      id: owner.id,
      username: owner.username,
      email: owner.email,
      avatar: owner.avatar
    } : null;

    res.json({
      ...project,
      tasks,
      memberDetails: memberDetails.filter(Boolean),
      ownerDetails
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Failed to get project' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, status } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owner can update project' });
    }

    const updates = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color) updates.color = color;
    if (status) updates.status = status;

    const updatedProject = await Project.updateProject(id, updates);

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Failed to update project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owner can delete project' });
    }

    // Delete all tasks in the project
    const tasks = await Task.getTasksByProject(id);
    await Promise.all(tasks.map(task => Task.delete(task.id)));

    // Delete the project
    await Project.delete(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Failed to delete project' });
  }
};

const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owner can add members' });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add member to project
    const updatedProject = await Project.addMember(id, user.id);

    res.json({
      message: 'Member added successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ message: 'Failed to add member' });
  }
};

const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user.id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId !== userId) {
      return res.status(403).json({ message: 'Only project owner can remove members' });
    }

    const updatedProject = await Project.removeMember(id, memberId);

    res.json({
      message: 'Member removed successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ message: 'Failed to remove member' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
