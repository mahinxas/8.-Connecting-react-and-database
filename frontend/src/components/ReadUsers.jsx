import { useState, useEffect } from "react";
import axios from "axios";

export default function ReadUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/users");
                setUsers(response.data);
                setError(""); // Clear error on success
            } catch (err) {
                setError("❌ Error fetching users: " + (err.response?.data?.error || err.message));
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-3 border rounded bg-light my-3">
            <h2 className="text-primary">Users List</h2>

            {/* Error Message */}
            {error && <p className="text-danger">{error}</p>}

            {/* Users List */}
            {users.length === 0 ? (
                <p className="text-muted">No users found.</p>
            ) : (
                <ul className="list-group">
                    {users.map((user) => (
                        <li key={user.id} className="list-group-item">
                            <strong>{user.name}</strong> ({user.email}) - ID: {user.id}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
