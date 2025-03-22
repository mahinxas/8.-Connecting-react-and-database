import { useState } from "react";
import axios from "axios";

export default function DeleteUser({ userId, name, email, phone, onUserDeleted }) {
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
      setMessage(`✅ User ${name} deleted successfully.`);
      if (onUserDeleted) onUserDeleted(); // Refresh user list
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="p-3 border rounded bg-light my-2">
      <p>
        <strong>{name}</strong> ({email}) {phone && `📞 ${phone}`}
      </p>
      <button onClick={handleDelete} className="btn btn-danger">Delete</button>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}
