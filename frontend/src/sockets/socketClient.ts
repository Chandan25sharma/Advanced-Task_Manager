import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Project-related events
  joinProject(projectId: string) {
    if (this.socket) {
      this.socket.emit('join-project', projectId);
    }
  }

  leaveProject(projectId: string) {
    if (this.socket) {
      this.socket.emit('leave-project', projectId);
    }
  }

  // Task-related events
  emitTaskUpdated(data: any) {
    if (this.socket) {
      this.socket.emit('task-updated', data);
    }
  }

  emitTaskStatusChanged(data: any) {
    if (this.socket) {
      this.socket.emit('task-status-changed', data);
    }
  }

  emitTaskCreated(data: any) {
    if (this.socket) {
      this.socket.emit('task-created', data);
    }
  }

  emitTaskDeleted(data: any) {
    if (this.socket) {
      this.socket.emit('task-deleted', data);
    }
  }

  emitCommentAdded(data: any) {
    if (this.socket) {
      this.socket.emit('comment-added', data);
    }
  }

  emitTimeSessionAdded(data: any) {
    if (this.socket) {
      this.socket.emit('time-session-added', data);
    }
  }

  emitProjectUpdated(data: any) {
    if (this.socket) {
      this.socket.emit('project-updated', data);
    }
  }

  // Typing indicators
  emitTypingStart(data: { projectId: string; taskId: string }) {
    if (this.socket) {
      this.socket.emit('typing-start', data);
    }
  }

  emitTypingStop(data: { projectId: string; taskId: string }) {
    if (this.socket) {
      this.socket.emit('typing-stop', data);
    }
  }

  // User presence
  emitUserActive() {
    if (this.socket) {
      this.socket.emit('user-active');
    }
  }

  // Event listeners
  onTaskUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('task-updated', callback);
    }
  }

  onTaskStatusChanged(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('task-status-changed', callback);
    }
  }

  onTaskCreated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('task-created', callback);
    }
  }

  onTaskDeleted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('task-deleted', callback);
    }
  }

  onCommentAdded(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('comment-added', callback);
    }
  }

  onTimeSessionAdded(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('time-session-added', callback);
    }
  }

  onProjectUpdated(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('project-updated', callback);
    }
  }

  onUserTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-typing', callback);
    }
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-stopped-typing', callback);
    }
  }

  onUserOnline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-online', callback);
    }
  }

  onUserOffline(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('user-offline', callback);
    }
  }

  // Remove event listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

export const socketClient = new SocketClient();
export default socketClient;
