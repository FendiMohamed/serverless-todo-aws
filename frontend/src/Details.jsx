import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTodo, updateTodo, deleteTodo } from "./utils/apis";
import reactImg from "./assets/react.svg";

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [todo, setTodo] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        getTodo(id).then(data => setTodo(data.Item));
    }, [id]);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    const handleUpdate = () => {
        updateTodo(id, todo).then(() => toggleEditMode());
    };

    const handleDelete = () => {
        deleteTodo(id).then(() => navigate("/"));
    };

    // No need for priority text/color, just show the number

    if (!todo) return <p>Loading...</p>;

    return (
        <div className="container">
            <h1>{editMode ? "Edit Todo" : todo.title}</h1>
            {editMode ? (
                <>
                    <input 
                        className="styled-input" 
                        placeholder="Todo ID"
                        value={todo.todoId} 
                        onChange={e => setTodo({ ...todo, todoId: e.target.value })} 
                    />
                    <input 
                        className="styled-input" 
                        placeholder="Title"
                        value={todo.title} 
                        onChange={e => setTodo({ ...todo, title: e.target.value })} 
                    />
                    <textarea 
                        className="styled-input" 
                        placeholder="Description"
                        value={todo.description || ""} 
                        onChange={e => setTodo({ ...todo, description: e.target.value })} 
                        rows="3"
                    />
                    <input
                        className="styled-input"
                        type="number"
                        value={todo.priority}
                        onChange={e => setTodo({ ...todo, priority: Number(e.target.value) })}
                        placeholder="Priority number"
                    />
                    <label>
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={e => setTodo({ ...todo, completed: e.target.checked })} 
                        /> Completed
                    </label>
                </>
            ) : (
                <>
                    <img src={reactImg} alt="todo" />
                    <p><strong>Description:</strong> {todo.description || "No description"}</p>
                    <p>
                        <strong>Priority:</strong> {todo.priority}
                    </p>
                    <p><strong>Status:</strong> {todo.completed ? "✅ Completed" : "⏳ Pending"}</p>
                    {todo.createdAt && (
                        <p><strong>Created:</strong> {new Date(todo.createdAt).toLocaleDateString()}</p>
                    )}
                    {todo.updatedAt && (
                        <p><strong>Last Updated:</strong> {new Date(todo.updatedAt).toLocaleDateString()}</p>
                    )}
                </>
            )}
            <div className="button-group">
                <button onClick={editMode ? handleUpdate : toggleEditMode}>
                    {editMode ? "Save" : "Edit"}
                </button>
                <button onClick={handleDelete} className="delete-btn">Delete</button>
                <button onClick={() => navigate("/")} className="back-btn">Back to List</button>
            </div>
        </div>
    );
};

export default Details;
