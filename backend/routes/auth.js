// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Ensure your User model is correctly defined
// const router = express.Router();


// router.post('/register', async (req, res) => {
//     const { email, password, name, avatar } = req.body; // Include avatar if applicable

//     // Check if email, name, and password are provided
//     if (!email || !name || !password) {
//         return res.status(400).json({ message: 'Name, email, and password are required.' });
//     }

//     // Password length validation
//     if (password.length < 6) {
//         return res.status(400).json({ message: 'Password should be at least 6 characters long.' });
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'User already exists with this email.' });
//         }

//         // Hash the password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user with name, email, hashed password, and avatar (or default avatar)
//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             avatar: avatar || 'https://example.com/default-avatar.png' // Use default avatar if not provided
//         });

//         await newUser.save();

//         return res.status(201).json({ message: 'User registered successfully.', user: newUser });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// });
// // Login route
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     // Check if email and password are provided
//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required.' });
//     }

//     try {
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "User not found" });

//         // Compare password with the hashed password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Return token and user details (email and name)
//         res.json({
//             token,
//             user: {
//                 id:user._id,
//                 email: user.email,
//                 name: user.name
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error.' });
//     }
// });


// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({ 
            
//         });
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch users.' });
//     }
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure your User model is correctly defined
const router = express.Router();

// Register route  account update delete code
router.post('/register', async (req, res) => {
    const { email, password, name , avatar} = req.body; // Removed avatar

    // Check if email, name, and password are provided
    if (!email || !name || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Password length validation
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters long.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with name, email, and hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            avatar
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token and user details (email and name)
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Fetch all users route
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Exclude passwords from the response
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
});

// Fetch user by ID route
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
});

// Update user details (excluding avatar)
router.put('/users/:id', async (req, res) => {
    const { name, email } = req.body; // Removed avatar

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email }, // Update name and email only
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the response

        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).send('Server error');
    }
});

// Update user password
router.put('/users/:id/password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

        // Hash new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send('Server error');
    }
});

// Delete user account
router.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send('User not found');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send('Server error');
    }
}); 

module.exports = router;


