import { useState } from "react";
import axios from "axios";

export default function UpdateUser({ onUserUpdated, buttonClass = "btn btn-warning" }) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!id || !name || !email) {
            setMessage("⚠️ All fields are required!");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, { name, email });
            setMessage(`✅ User updated successfully: ${response.data.id}`);
            setId("");
            setName("");
            setEmail("");
            if (onUserUpdated) onUserUpdated(); // Refresh list if function is provided
        } catch (error) {
            setMessage("❌ Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="p-3 border rounded bg-light my-3">
            <h2 className="text-warning">Update User</h2>

            {/* Form for Updating User */}
            <form onSubmit={handleUpdate} className="mb-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="User ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className={buttonClass}>Update</button>
            </form>

            {/* Display messages */}
            {message && <p className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`}>{message}</p>}
        </div>
    );
}
