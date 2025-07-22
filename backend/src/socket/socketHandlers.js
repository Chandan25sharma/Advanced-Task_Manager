const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user.id;
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

const handleConnection = (io) => {
  return (socket) => {
    console.log(`User ${socket.user.username} connected (${socket.id})`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Handle joining project rooms
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.user.username} joined project ${projectId}`);
    });

    // Handle leaving project rooms
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.user.username} left project ${projectId}`);
    });

    // Handle task updates
    socket.on('task-updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-updated', {
        ...data,
        updatedBy: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle task status changes (drag & drop)
    socket.on('task-status-changed', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-status-changed', {
        ...data,
        updatedBy: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle new task creation
    socket.on('task-created', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-created', {
        ...data,
        createdBy: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle task deletion
    socket.on('task-deleted', (data) => {
      socket.to(`project:${data.projectId}`).emit('task-deleted', {
        ...data,
        deletedBy: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle comments
    socket.on('comment-added', (data) => {
      socket.to(`project:${data.projectId}`).emit('comment-added', {
        ...data,
        user: {
          id: socket.user.id,
          username: socket.user.username,
          avatar: socket.user.avatar
        }
      });
    });

    // Handle time tracking
    socket.on('time-session-added', (data) => {
      socket.to(`project:${data.projectId}`).emit('time-session-added', {
        ...data,
        user: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle project updates
    socket.on('project-updated', (data) => {
      socket.to(`project:${data.projectId}`).emit('project-updated', {
        ...data,
        updatedBy: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle user typing indicators
    socket.on('typing-start', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-typing', {
        taskId: data.taskId,
        user: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    socket.on('typing-stop', (data) => {
      socket.to(`project:${data.projectId}`).emit('user-stopped-typing', {
        taskId: data.taskId,
        user: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    // Handle user presence
    socket.on('user-active', () => {
      socket.broadcast.emit('user-online', {
        id: socket.user.id,
        username: socket.user.username,
        avatar: socket.user.avatar
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.user.username} disconnected (${reason})`);
      socket.broadcast.emit('user-offline', {
        id: socket.user.id,
        username: socket.user.username
      });
    });

    // Send initial connection confirmation
    socket.emit('connected', {
      message: 'Connected successfully',
      user: {
        id: socket.user.id,
        username: socket.user.username,
        avatar: socket.user.avatar
      }
    });
  };
};

module.exports = {
  socketAuth,
  handleConnection
};
