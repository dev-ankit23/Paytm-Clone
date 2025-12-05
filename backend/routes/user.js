import express from "express";
import userModel from "../db.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

const userRouter = express.Router();
const JWT_SECRET = "ankitaewore2";

const signupBody = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinBody = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { success, error } = signupBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
        errors: error.errors,
      });
    }

    const existingUser = await userModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken",
      });
    }

    const newUser = await userModel.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const userId = newUser._id;

    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
      message: "User created successfully",
      token: token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { success, error } = signinBody.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Incorrect inputs",
        errors: error.errors,
      });
    }

    const user = await userModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!user) {
      return res.status(411).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
      message: "Signed in successfully",
      token: token,
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default userRouter;
