// message_schema.js

import mongoose from "mongoose";
import connectToDatabase from "../db"; // Import the connectToDatabase function

// Call the connectToDatabase function to establish the MongoDB connection
connectToDatabase();

// Define a schema for the messages
const messageSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create a model for the messages
const Message = mongoose.model("Message", messageSchema);

export default Message;
