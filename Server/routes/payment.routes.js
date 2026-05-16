import express from "express";
import { createOrder, handleWebhook, verifyPayment } from "../controllers/payment.controller.js";


const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", createOrder);
paymentRoutes.post("/verify", verifyPayment);
paymentRoutes.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default paymentRoutes;