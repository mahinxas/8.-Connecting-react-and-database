const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to a SQLite database using Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
    logging: console.log // Print SQL commands for debugging
});

// Define User model with the new "phone" field
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false // Ensure phone number is required
    }
}, {
    timestamps: false
});

// Synchronize database
sequelize.sync()
    .then(() => console.log("✅ Database synchronized"))
    .catch(err => console.error("❌ Error synchronizing database:", err));

// Create a new user (Create)
app.post('/users', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }
        const user = await User.create({ name, email, phone });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all users (Read)
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user information (Update)
app.put('/users/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { id } = req.params;
        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Name, email, and phone are required' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.name = name;
        user.email = email;
        user.phone = phone;
        await user.save();
        res.json({ message: 'User information updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user (Delete)
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted', id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
