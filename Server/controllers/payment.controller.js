// import dotenv from "dotenv";
// dotenv.config();

// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Registration from "../models/user.model.js";


// export const createOrder = async (req, res) => {

//   try {

//     // Initialize Razorpay inside function
//     const razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });
//     const { amount } = req.body;

//     // Validation
//     if (!amount) {
//       return res.status(400).json({
//         success: false,
//         message: "Amount is required",
//       });
//     }

//     const options = {
//       amount: amount * 100, // Convert ₹ to paisa
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });

//   } catch (error) {
//     console.error("Create order error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Order creation failed",
//       error: error.message,
//     });
//   }
// };

// export const verifyPayment = async (req, res) => {
//   try {

//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       registrationId,
//     } = req.body;

//     // Validate required fields
//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment details are missing",
//       });
//     }

//     // Generate signature
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body)
//       .digest("hex");

//     // Verify signature
//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment signature",
//       });
//     }

//     // Update registration payment status
//     await Registration.findByIdAndUpdate(registrationId, {
//       paymentStatus: "Completed",
//       paymentId: razorpay_payment_id,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//     });

//   } catch (error) {
//     console.error("Verify payment error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Payment verification failed",
//       error: error.message,
//     });
//   }
// };


import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import crypto from "crypto";
import Registration from "../models/user.model.js";

// ─── Cashfree Config ───────────────────────────────────────────────────────────
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

    // Validation
    if (!amount || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: "Amount, customerName, customerEmail, and customerPhone are required",
      });
    }

    const orderId = `order_${Date.now()}`;

    const orderData = {
      order_id: orderId,
      order_amount: amount,        // ₹ directly — NO need to multiply by 100
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
    const { order_id, registrationData } = req.body; // ✅ changed registrationId → registrationData

    if (!order_id || !registrationData) {
      return res.status(400).json({
        success: false,
        message: "order_id and registrationData are required",
      });
    }

    // Fetch order status from Cashfree
    const response = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${order_id}`,
      { headers: cashfreeHeaders }
    );

    const orderData = response.data;

    if (orderData.order_status !== "PAID") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${orderData.order_status}`,
      });
    }

    // Fetch payment details
    const paymentsResponse = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${order_id}/payments`,
      { headers: cashfreeHeaders }
    );

    const payments = paymentsResponse.data;
    const successfulPayment = payments.find((p) => p.payment_status === "SUCCESS");

    // ✅ Create new registration with form data + payment info
    const registration = new Registration({
      ...registrationData,
      paymentStatus: "Completed",
      paymentId: successfulPayment?.cf_payment_id || orderData.cf_order_id,
      orderId: order_id,
    });

    await registration.save();

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

// ─── Webhook Handler (optional but recommended) ────────────────────────────────
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    // Verify webhook signature
    const signedPayload = `${timestamp}${JSON.stringify(req.body)}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(signedPayload)
      .digest("base64");

    if (expectedSignature !== signature) {
      return res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const { data, type } = req.body;

    // Handle successful payment event
    if (type === "PAYMENT_SUCCESS_WEBHOOK") {
      const { order, payment } = data;

      await Registration.findOneAndUpdate(
        { paymentId: order.order_id },  // match by order_id if stored earlier
        {
          paymentStatus: "Completed",
          paymentId: payment.cf_payment_id,
        }
      );
    }

    res.status(200).json({ success: true, message: "Webhook received" });

  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};