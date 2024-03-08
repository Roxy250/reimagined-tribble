// user_schema.js

import mongoose from "mongoose";

// Define a schema for the users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    socketId: {
        type: String,
        required: true
    },
    // Add any additional fields here as needed
    isHost: {
        type: Boolean,
        required: true
    },
    hosting_room_name: {
        type: String,
        // Only required if the user is a host
        required: function() {
            return this.isHost === true;
        }
    },
    hosting_password: {
        type: String,
        // Only required if the user is a host
        required: function() {
            return this.isHost === true;
        }
    }
});

// Create a model for the users
const User = mongoose.model("User", userSchema);

export default User;
