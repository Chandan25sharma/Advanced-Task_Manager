import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Plus, Users } from 'lucide-react';
import { RootState, AppDispatch } from '../redux/store';
import { fetchProject } from '../redux/projectSlice';
import { fetchTasks } from '../redux/taskSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const ProjectBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProject, isLoading: projectLoading } = useSelector((state: RootState) => state.projects);
  const { tasks, isLoading: tasksLoading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(id));
      dispatch(fetchTasks(id));
    }
  }, [dispatch, id]);

  if (projectLoading || tasksLoading) {
    return <LoadingSpinner />;
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project not found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'todo').sort((a, b) => a.position - b.position);
  const inProgressTasks = tasks.filter(task => task.status === 'inprogress').sort((a, b) => a.position - b.position);
  const doneTasks = tasks.filter(task => task.status === 'done').sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Link>
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: currentProject.color }}
                />
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentProject.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                {currentProject.memberDetails?.length || 0} members
              </div>
              <button className="btn-primary btn-sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Project Description */}
      {currentProject.description && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-gray-600">{currentProject.description}</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">To Do</h3>
              <span className="kanban-column-count">{todoTasks.length}</span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {todoTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks in To Do</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">In Progress</h3>
              <span className="kanban-column-count">{inProgressTasks.length}</span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div key={task.id} className="task-card">
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {inProgressTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No tasks in progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="kanban-column">
            <div className="kanban-column-header">
              <h3 className="kanban-column-title">Done</h3>
              <span className="kanban-column-count">{doneTasks.length}</span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <div key={task.id} className="task-card opacity-75">
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`badge priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      ✓ Completed
                    </span>
                  </div>
                </div>
              ))}
              {doneTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No completed tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectBoard;
