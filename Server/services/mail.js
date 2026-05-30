import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Reusable mail sender
export const sendMail = async ({
  to,
  subject,
  text = "",
  html = "",
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ahilyanagar Armwrestling Tournament" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Mail error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};