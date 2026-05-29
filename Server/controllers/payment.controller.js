import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import crypto from "crypto";
import Registration from "../models/user.model.js";
import { registrationMailTemplate } from "../services/templates/registrationMail.js";
import { sendMail } from "../services/mail.js";

const CASHFREE_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const cashfreeHeaders = {
  "x-client-id": process.env.CASHFREE_APP_ID,
  "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  "x-api-version": "2023-08-01",
  "Content-Type": "application/json",
};

// ─── Create Order ──────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Amount, customerName, customerEmail, and customerPhone are required",
      });
    }

    const orderId = `order_${Date.now()}`;

    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/success?order_id={order_id}`,
      },
    };

    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      orderData,
      { headers: cashfreeHeaders }
    );

    res.status(200).json({
      success: true,
      order: response.data,
      payment_session_id: response.data.payment_session_id,
      order_id: orderId,
    });

  } catch (error) {
    console.error("Create order error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.response?.data || error.message,
    });
  }
};

// ─── Verify Payment ────────────────────────────────────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const { order_id, registrationData } = req.body;

    if (!order_id || !registrationData) {
      return res.status(400).json({
        success: false,
        message: "order_id and registrationData are required",
      });
    }

    // Security 1 — Prevent duplicate registration
    // If someone retries after CORS/network error, they won't be charged twice
    const existing = await Registration.findOne({ orderId: order_id });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified. Registration saved successfully.",
      });
    }

    // Security 2 — Always verify payment status from Cashfree directly
    // Never trust frontend — always confirm from Cashfree server
    const response = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${order_id}`,
      { headers: cashfreeHeaders }
    );

    const orderData = response.data;

    // Security 3 — Only proceed if Cashfree confirms PAID
    if (orderData.order_status !== "PAID") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${orderData.order_status}`,
      });
    }

    // Security 4 — Verify amount matches what you expected
    // Prevents someone from paying ₹1 
    const expectedAmount = 149;
    if (parseFloat(orderData.order_amount) !== expectedAmount) {
      console.error(`Amount mismatch: expected ${expectedAmount}, got ${orderData.order_amount}`);
      return res.status(400).json({
        success: false,
        message: "Payment amount mismatch. Please contact support.",
      });
    }

    // Fetch payment details
    const paymentsResponse = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${order_id}/payments`,
      { headers: cashfreeHeaders }
    );

    const payments = paymentsResponse.data;
    const successfulPayment = payments.find((p) => p.payment_status === "SUCCESS");

    // Security 5 — Save with full payment audit trail
    const registration = new Registration({
      ...registrationData,
      paymentStatus: "Completed",
      paymentId: successfulPayment?.cf_payment_id || orderData.cf_order_id,
      orderId: order_id,
      amount: orderData.order_amount,
      paidAt: new Date(),   // exact time of payment
    });

    await registration.save();

    const { subject, text } = registrationMailTemplate({
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      weightCategory: registrationData.weightCategory,
      amount: orderData.order_amount,
    });

    await sendMail({
      to: registrationData.email,
      subject,
      text,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and registration saved successfully",
    });

  } catch (error) {
    console.error("Verify payment error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};

// ─── Webhook — backup safety net ───────────────────────────────────────────────
// Even if user closes browser or CORS fails, webhook saves the registration
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.CASHFREE_SECRET_KEY;
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature || !timestamp) {
      return res.status(401).json({ success: false, message: "Missing webhook headers" });
    }

    // Security 6 — Verify webhook is genuinely from Cashfree
    const signedPayload = `${timestamp}${JSON.stringify(req.body)}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("base64");

    if (expectedSignature !== signature) {
      return res.status(401).json({ success: false, message: "Invalid webhook signature" });
    }

    const { data, type } = req.body;

    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order, payment } = data;

      // Security 7 — Webhook also checks for duplicate before saving
      const existing = await Registration.findOne({ orderId: order.order_id });

      if (!existing) {
        // Payment succeeded but registration missing (CORS/network failure case)
        // Webhook saves it automatically as a safety net
        console.log(`⚠️ Webhook saving missing registration for order: ${order.order_id}`);

        await Registration.create({
          orderId: order.order_id,
          paymentStatus: "Completed",
          paymentId: payment.cf_payment_id,
          amount: order.order_amount,
          paidAt: new Date(),
          // registrationData won't be here — contact customer via email
          webhookSaved: true,   // flag so admin knows to follow up
        });
      }
    }

    res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};