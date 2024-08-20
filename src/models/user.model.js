import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    githubProfileLink: {
        type: String,
        required: true,
    },
    reposUrl: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    vercelUrl: {
        type: String,
    },
    accessToken: {
        type: String,
    }
}, { timestamps: true })

export const User = mongoose.model("Users", userSchema);