import { useState } from "react";
import axios from "axios";

export default function CreateUser({ onUserAdded, buttonClass = "btn btn-primary" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("http://localhost:3000/users", {
        name,
        email,
        phone, // Added phone number to the request
      });

      setMessage(`✅ User created successfully: ${response.data.name}`);
      setName("");
      setEmail("");
      setPhone("");
      
      if (onUserAdded) onUserAdded(); // Refresh user list
    } catch (error) {
      setMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="container mt-3">
      <h2 className="text-primary">Create User</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm">
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className={buttonClass}>Create</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
