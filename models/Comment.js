const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  Activity: {
    type: mongoose.Schema.ObjectId,
    ref: "Activity",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please enter the comment"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
