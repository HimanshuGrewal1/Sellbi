import express from "express";
import { createOrder, getOrders } from "../controllers/orders.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { checkoutRateLimiter } from "../middlewares/ratelimiter.js";

const router = express.Router();

router.post("/create", verifyToken,checkoutRateLimiter, createOrder);
router.get("/", verifyToken, getOrders);

export default router;