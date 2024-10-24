
const express = require('express');
const router = express.Router();
const Room = require('../models/Room'); // Adjust this path as necessary
const User = require('../models/User'); // Assuming you have a User model

// Create a room
router.post('/create-room/:username', async (req, res) => {
    const { name } = req.body;
    const { username } = req.params;

    try {
        const user = await User.findOne({ name: username }); // Check for user existence
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newRoom = new Room({ name });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ error: 'Error creating room' });
    }
});

// Fetch all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find(); // Fetch all rooms
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching rooms' });
    }
});

module.exports = router;



