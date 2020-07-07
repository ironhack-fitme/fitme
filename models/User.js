const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Please enter your full name"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password should be atleast minimum of 6 characters"],
    maxlength: [12, "Password should be maximum of 12 characters"],
  },
  fitbitId: String,
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  avatar: {
    type: String,
    default: "URL to the default avatar",
  },
  bio: String,
  activites: [{ type: mongoose.Schema.ObjectId, ref: "Activity" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
