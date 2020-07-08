const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your e-mail"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  fitbitId: String,
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  avatar: {
    type: String,
    default: "URL to the default avatar",
  },
  avatarId: String,
  bio: String,
  activities: [{ type: mongoose.Schema.ObjectId, ref: "Activity" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
