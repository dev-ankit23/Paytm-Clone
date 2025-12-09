import mongoose from "mongoose";
import { object } from "zod";

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://ankitmauryacoder:nqZrFW1HTnBMEFTo@cluster0.akv6x97.mongodb.net/Paytm"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

const accountsSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userSchema,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
});
// Create and export User model
const userModel = mongoose.model("User", userSchema);
const accountsModel = mongoose.model("Accounts", accountsSchema);

export { userModel, accountsModel };
