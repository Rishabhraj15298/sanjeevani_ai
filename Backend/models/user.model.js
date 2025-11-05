import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // hide password by default
    },

    // One model, two possible roles
    role: {
      type: String,
      enum: ["patient", "doctor"],
      default: "patient",
    },

    // Doctor-specific fields
    specialization: { type: String, trim: true },

    // Patient-specific fields
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    medicalHistory: { type: [String], default: [] },
    consentGiven: { type: Boolean, default: false },

    // Common field
    location: String,
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);
export default User;
