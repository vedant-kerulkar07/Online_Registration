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
        "Below 50kg",
        "50-60kg",
        "60-70kg",
        "70-80kg",
        "80kg+",
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
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;