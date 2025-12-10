import express from "express";
import userRouter from "./user.js";
import accountsRouter from "./accounts.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/accounts", accountsRouter);

export default router;
