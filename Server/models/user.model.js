import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    weightCategory: {
      type: String,
      required: true,
      enum: [
        "Below 60kg",
        "Below 75kg",
        "Above 75kg+",
      ],
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    hand: {
      type: String,
      required: true,
      enum: ["Right", "Left"],
    },
    orderId: {
      type: String,
    },
    // Add to user.model.js
    paidAt: {
      type: Date,
      default: null,
    },
    webhookSaved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;