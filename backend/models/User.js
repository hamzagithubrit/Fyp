
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // URL for user avatar image
        default: 'https://images.pexels.com/photos/11619096/pexels-photo-11619096.jpeg?auto=compress&cs=tinysrgb&w=600', // Set a default avatar URL
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        }
    ],
    rooms: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',
        }
    ],
    // role:[
    //     enum: [user,admin];
    //     default: user
    // ]
});

module.exports = mongoose.model('User', UserSchema);


