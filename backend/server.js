const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const roomRoutes = require("./routes/roomRoutes"); // Import the room routes
const Message = require("./models/Message"); // Import the Message model
const {key,secret,cloudnery} = require("../backend/cloud")
const cloudnary=require("cloudinary").v2;
const multer=require('multer');
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const router = express.Router()


require("dotenv").config();

cloudnary.config({
    cloud_name: cloudnery,
    api_key: key,
    api_secret: secret,
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudnary,
    params: {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "pdf", "doc", "docx", "xls", "xlsx"], // Add more formats as needed
    },
  });
  
  const upload = multer({ storage: storage });
  
  // File upload route
  router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
  
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.bytes,
      url: req.file.path, // Cloudinary URL
    };
  
    res.status(200).json({
      message: "File uploaded successfully to Cloudinary",
      file: fileInfo,
    });
  });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 4000;
const { v4: uuidv4 } = require('uuid');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/rooms", roomRoutes); // Add the correct room routes path

// Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a private room
    socket.on('join_room', ({ senderId, receiverId }) => {
        const roomId = [senderId, receiverId].sort().join('_'); // Create a unique room for both users
        socket.join(roomId);
        console.log(`User ${senderId} joined room ${roomId}`);
    });

    // Handle sending private messages
    socket.on('send_message', async (messageData) => {
        const roomId = [messageData.senderId, messageData.receiverId].sort().join('_'); // Ensure they are in the same room

        // Save the message to the database
        const newMessage = new Message(messageData);
        await newMessage.save();

        console.log(newMessage,"new")

        // Send the message to both users in the room
        io.to(roomId).emit('receive_message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





