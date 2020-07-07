const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const activitySchema = new Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
  },
  activityType: {
    required: true,
    type: String,
    default: "Running",
    enum: [
      "Running",
      "Walking",
      "Swim",
      "Aerobics",
      "Cycling",
      "Climbing",
      "Treadmill",
    ],
  },
  calories: Number,
  photo: String,
  photoId: String,
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
  duration: Number,
  distance: Number,
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
