import { useState, useEffect } from "react";
import axios from "axios";

export default function ReadDeleteUsers({ refresh, buttonClass = "btn btn-danger" }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Function to fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
            setError(""); // Clear error on success
        } catch (err) {
            setError("❌ Error fetching users: " + (err.response?.data?.error || err.message));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]); // Refresh users when 'refresh' changes

    // Function to handle user deletion
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers(); // Refresh user list after deletion
            setMessage(`✅ User '${name}' deleted successfully.`);
        } catch (error) {
            setMessage("❌ Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="p-3 border rounded bg-light my-3">
            <h2 className="text-danger">Users List</h2>

            {/* Error & Success Messages */}
            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            {/* User List */}
            {users.length === 0 ? (
                <p className="text-muted">No users found.</p>
            ) : (
                <ul className="list-group">
                    {users.map((user) => (
                        <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>{user.name}</strong> ({user.email})
                            </span>
                            <button onClick={() => handleDelete(user.id, user.name)} className={buttonClass}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
