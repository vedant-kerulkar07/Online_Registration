
import { registrationSchema } from "../validations/registration.validation.js";
import { sendMail } from "../services/mail.js";
import { registrationMailTemplate } from "../services/templates/registrationMail.js";
import Registration from "../models/user.model.js";

export const createRegistration = async (req, res) => {
  try {
    // ✅ 1. Validate request using Zod
    const parseResult = registrationSchema.safeParse(req.body);

    if (!parseResult.success) {
      const fieldErrors = {};

      parseResult.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field) fieldErrors[field] = err.message;
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: fieldErrors,
      });
    }

    // ✅ 2. Extract validated data
    const {
      firstName,
      middleName,
      lastName,
      email,
      contactNumber,
      weightCategory,
      address,
      hand,
    } = parseResult.data;

    // ✅ 3. Dynamic amount logic (backend controlled)
    let amount = 150;
    if (weightCategory === "80kg+") {
      amount = 150;
    }

    // ✅ 4. Create registration
    const newRegistration = new Registration({
      firstName,
      middleName: middleName || "",
      lastName,
      email,
      contactNumber,
      weightCategory,
      amount,
      address,
      hand,
      paymentStatus: "Pending",
      paymentId: "",
    });

    await newRegistration.save();

    // ✅ 5. Send email (non-blocking)
    try {
      const mailContent = registrationMailTemplate({
        firstName,
        lastName,
        weightCategory,
        amount,
      });

      await sendMail({
        to: email,
        subject: mailContent.subject,
        text: mailContent.text,
      });
    } catch (err) {
      console.log("Email failed but registration saved:", err.message);
    }

    // ✅ 6. Response
    return res.status(201).json({
      success: true,
      message: "Registration successful",
      registration: newRegistration,
      amount,
    });

  } catch (error) {
    console.error("createRegistration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};