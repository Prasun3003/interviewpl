import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: "https://plus.unsplash.com/premium_photo-1739178656495-8109a8bc4f53?q=80&w=2274&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
},{timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;