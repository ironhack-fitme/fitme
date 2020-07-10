const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  fullname: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
  },
  fitbitId: String,
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/ironhack-fitme/image/upload/v1594200960/FitMe/index.png",
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
