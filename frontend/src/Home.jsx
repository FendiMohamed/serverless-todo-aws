import { useEffect, useState } from "react";
import { fetchTodos, createTodo } from "./utils/apis";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoId, setTodoId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos().then(data => setTodos(data.Items || []));
  }, []);

  const handleAddTodo = async () => {
    if (!todoId || !title) {
      alert("Please fill required fields (Todo ID and Title)");
      return;
    }
    
    setLoading(true);
    try {
      const newTodo = { 
        todoId, 
        title, 
        description, 
        priority: Number(priority), 
        completed 
      };
      await createTodo(newTodo);
      setTodos([...todos, { ...newTodo, createdAt: new Date().toISOString() }]);
      
      // Reset form and close modal
      setTodoId("");
      setTitle("");
      setDescription("");
      setPriority(1);
      setCompleted(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating todo:', error);
      alert('Error creating todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // No need for priority text/icon/color, just show the number

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">📝 Todo Manager</h1>
          <p className="app-subtitle">Stay organized and productive</p>
        </div>
        <button 
          className="add-todo-btn"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="btn-icon">+</span>
          Add New Todo
        </button>
      </header>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{todos.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{todos.filter(todo => todo.completed).length}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{todos.filter(todo => !todo.completed).length}</span>
          <span className="stat-label">Remaining</span>
        </div>
      </div>

      {/* Todo List */}
      <div className="todos-container">
        {todos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No todos yet!</h3>
            <p>Create your first todo to get started</p>
            <button 
              className="empty-action-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Create First Todo
            </button>
          </div>
        ) : (
          <div className="todo-list">
            {todos
              .sort((a, b) => {
                // Sort by priority first (1 = highest, 3 = lowest)
                if (a.priority !== b.priority) {
                  return a.priority - b.priority;
                }
                // If same priority, sort by completion status (incomplete first)
                if (a.completed !== b.completed) {
                  return a.completed ? 1 : -1;
                }
                // If same priority and completion, sort by creation date (newest first)
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
              })
              .map(todo => (
              <div 
                key={todo.todoId} 
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                onClick={() => navigate(`/details/${todo.todoId}`)}
              >
                <div className="todo-main">
                  <div className="todo-checkbox">
                    <div className={`checkbox ${todo.completed ? 'checked' : ''}`}>
                      {todo.completed && '✓'}
                    </div>
                  </div>
                  
                  <div className="todo-content">
                    <h3 className="todo-title">{todo.title}</h3>
                    {todo.description && (
                      <p className="todo-description">{todo.description}</p>
                    )}
                    
                    <div className="todo-meta">
                      <span className="priority-badge">
                        Priority: {todo.priority}
                      </span>
                      {todo.createdAt && (
                        <span className="created-date">
                          Created {new Date(todo.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="todo-actions">
                  <button className="action-btn edit-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/details/${todo.todoId}`);
                  }}>
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Todo</h2>
              <button 
                className="close-btn"
                onClick={() => !loading && setIsModalOpen(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="todoId">Todo ID *</label>
                <input 
                  id="todoId"
                  className="form-input" 
                  type="text" 
                  placeholder="Enter unique ID" 
                  value={todoId} 
                  onChange={(e) => setTodoId(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input 
                  id="title"
                  className="form-input" 
                  type="text" 
                  placeholder="What needs to be done?" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description"
                  className="form-input form-textarea" 
                  placeholder="Add more details (optional)" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <input
                  id="priority"
                  className="form-input"
                  type="number"
                  min={0}
                  value={priority}
                  onChange={e => setPriority(Number(e.target.value))}
                  disabled={loading}
                  placeholder="Enter priority number"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={completed} 
                    onChange={(e) => setCompleted(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Mark as completed
                </label>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddTodo}
                disabled={loading || !todoId || !title}
              >
                {loading ? 'Creating...' : 'Create Todo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;