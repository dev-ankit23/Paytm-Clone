import express from "express";
import authMiddleware from "../middelware.js";
import { accountsModel } from "../db.js";
import mongoose, { startSession } from "mongoose";

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  const account = await accountsModel.findOne({
    userId: req.userId,
  });

  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  res.json({
    balance: account.balance,
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  // FETCHING THE ACCOUNTS
  const account = await accountsModel
    .findOne({ userId: req.userId })
    .session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }
  const toAccount = await accountsModel
    .findOne({ userId: to })
    .session(session);

  if (!toAccount) {
    await session.abortTransaction();
    res.status(400).json({
      message: "Invalid account",
    });
  }
  await accountsModel
    .updateOne({ userId: req.userId }, { $inc: { balance: -amount } })
    .session(session);
  await accountsModel
    .updateOne({ userId: to }, { $inc: { balance: amount } })
    .session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

export default router;
