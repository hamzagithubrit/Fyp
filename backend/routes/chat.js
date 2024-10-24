const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();

// Get messages for a specific room
router.get("/messages/:roomId", async (req, res) => {  // request for message
    try {
        const messages = await Message.find({ roomId: req.params.roomId })
            .populate("sender", "username") // Populate sender field to get the username
            .exec();
        res.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" }); //aoun
    }
});

// Fetch messages between two users
router.get('/messages/:userId/:otherUserId', async (req, res) => {
    const { userId, otherUserId } = req.params;

    console.log(userId,'udrid')

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId },
            ],
        }).sort({ timestamp: 1 })
        .populate('senderId', 'name avatar') 
        .populate('receiverId', 'name avatar');

        
        // Sort messages by timestamp ascending

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});


// Save a message to the database
router.post("/messages", async (req, res) => {
    const { roomId, content, sender } = req.body; // Include sender in the message

    const newMessage = new Message({
        roomId, // Assuming you're also passing roomId to the Message schema
        content,
        sender, // This should be the ObjectId of the sender
    });

    try {
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
});

//Create a new user
router.post("/users", async (req, res) => {
    const { username } = req.body;

    try {
        const newUser = new User({ username });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});






module.exports = router;


