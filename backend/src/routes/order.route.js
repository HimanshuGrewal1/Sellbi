import express from "express";
import { createOrder, getOrders } from "../controllers/orders.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post("/create", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);

export default router;