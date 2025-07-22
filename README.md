# Task Manager - Full-Stack Collaboration App

A comprehensive task management web application built with React, Node.js, Socket.io, and JSON file storage. Features real-time collaboration, drag & drop task boards, team workspaces, and time tracking.

## 🚀 Features

- **Real-Time Collaboration** - Live updates with Socket.io
- **Drag & Drop Task Board** - Kanban-style interface with beautiful transitions
- **Team Workspaces** - Multi-project support with role-based access
- **Time Tracking & Analytics** - Monitor progress and generate insights
- **Comments & File Attachments** - Rich task discussion and file management
- **Responsive Design** - Works seamlessly on desktop and mobile
- **JWT Authentication** - Secure user authentication and authorization
- **JSON Storage** - Simple file-based data persistence

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with RTK Query
- **Tailwind CSS** - Utility-first CSS framework
- **React Beautiful DnD** - Drag and drop functionality
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form handling and validation
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **JSON Files** - Simple file-based storage
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   PORT=5000
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment variables (optional):
   ```bash
   # Create .env.local for custom configuration
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Full Application Startup

To run both frontend and backend simultaneously:

1. **Terminal 1** - Backend:
   ```bash
   cd backend
   npm run dev
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Socket.io: http://localhost:5000

## 🎯 Usage

### Getting Started

1. **Register a new account** or login with existing credentials
2. **Create your first project** from the dashboard
3. **Add team members** by email to collaborate
4. **Create tasks** and organize them in To Do, In Progress, and Done columns
5. **Drag and drop** tasks between columns to update their status
6. **Add comments** and track time on tasks
7. **Monitor progress** with real-time updates

### Key Features

#### Project Management
- Create unlimited projects with custom colors
- Add team members and manage permissions
- View project statistics and progress

#### Task Management
- Create tasks with titles, descriptions, and due dates
- Set priority levels (Low, Medium, High)
- Assign tasks to team members
- Add tags for better organization

#### Real-Time Collaboration
- See live updates when team members make changes
- Real-time notifications for task updates
- User presence indicators

#### Time Tracking
- Track time spent on tasks
- View time analytics and reports
- Set estimated vs actual time

## 🏗️ Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Data models (JSON handlers)
│   │   ├── routes/          # API routes
│   │   ├── socket/          # Socket.io event handlers
│   │   ├── middleware/      # Authentication & error handling
│   │   ├── utils/           # Utility functions
│   │   ├── data/            # JSON data files
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server startup
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux store and slices
│   │   ├── api/             # API service functions
│   │   ├── sockets/         # Socket.io client handlers
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add project member
- `DELETE /api/projects/:id/members/:memberId` - Remove member

### Tasks
- `GET /api/tasks` - Get tasks (optionally filtered by project)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/status` - Update task status/position
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment to task
- `POST /api/tasks/:id/time` - Add time session to task

## 🔌 Socket.io Events

### Client to Server
- `join-project` - Join project room for real-time updates
- `leave-project` - Leave project room
- `task-updated` - Notify task changes
- `task-status-changed` - Notify task status/position changes
- `task-created` - Notify new task creation
- `task-deleted` - Notify task deletion
- `comment-added` - Notify new comment
- `typing-start/stop` - Typing indicators

### Server to Client
- `task-updated` - Receive task updates
- `task-status-changed` - Receive status changes
- `task-created` - Receive new tasks
- `task-deleted` - Receive task deletions
- `comment-added` - Receive new comments
- `user-typing` - Receive typing indicators
- `user-online/offline` - User presence updates

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder with a static file server
3. Update API URLs for production environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue
4. Provide relevant logs and error messages

## 🔮 Future Enhancements

- [ ] File upload and attachment support
- [ ] Advanced search and filtering
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Database migration option (MongoDB, PostgreSQL)
- [ ] Docker containerization
- [ ] CI/CD pipeline setup

---

**Built with ❤️ by the Task Manager Team**
