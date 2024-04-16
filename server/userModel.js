const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    integratorId: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Please provide an email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;