import express from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authMiddleware from "../middelware.js";
import { userModel, accountsModel } from "../db.js";

const userRouter = express.Router();
const JWT_SECRET = "ankitaewore2";
const saltRounds = 10;

const signupBody = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const updateUserSchema = z.object({
  username: z.string().min(3).max(30).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

// SIGNUP
userRouter.post("/signup", async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const parsed = signupBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.errors,
      });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    await accountsModel.create({
      userId: newUser._id,
      balance: 1 + Math.random() * 1000,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);

    res.json({ message: "User created", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// SIGNIN
userRouter.post("/signin", async (req, res) => {
  try {
    const parsed = signinBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    const { email, password } = parsed.data;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.json({ message: "Signed in", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE
userRouter.put("/update", authMiddleware, async (req, res) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid inputs" });
    }

    const data = parsed.data;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    await userModel.findByIdAndUpdate(req.userId, data);
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// BUlk

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await userModel.find({
    username: {
      $regex: filter,
      $options: "i", // case-insensitive
    },
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      _id: user._id,
    })),
  });
});

export default userRouter;
