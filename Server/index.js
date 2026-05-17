// index.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.routes.js';
import registrationRoutes from './routes/registration.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// ✅ Fix 1 — handle preflight first, before any other middleware
app.options(/(.*)/, cors());

// ✅ Fix 2 — allow multiple frontend URLs
app.use(
  cors({
    origin: [
      "https://ahilyanagar-armwrestling.vercel.app",  // your frontend
      "http://localhost:5173",                          // local dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/registration", registrationRoutes);
app.use("/api/payment", paymentRoutes);

mongoose
  .connect(MONGO_URI, { dbName: 'ahilyanagar-armwrestling' })
  .then(() => console.log('✅ Database connected'))
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});