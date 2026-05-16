import express from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";


const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", createOrder);
paymentRoutes.post("/verify", verifyPayment);

export default paymentRoutes;