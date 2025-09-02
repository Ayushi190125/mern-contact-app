import mongoose from "mongoose";

const phoneRegex = /^\(\d{3}\)-\d{3}-\d{4}$/; 
const emailRegex = /\S+@\S+\.\S+/; 

const RecordSchema = new mongoose.Schema(
  {
    first: { type: String, required: true },
    last: { type: String, required: true },
    phone: { 
      type: String, 
      required: [true, "Phone is required"],
      match: [phoneRegex, "Phone must be in format (123)-456-7890"]
    },
    email: { 
      type: String, 
      required: [true, "Email is required"],
      match: [emailRegex, "Email must contain @ and ."]
    },
    address: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: ""}
  },
  { timestamps: true }
);

export default mongoose.model("Record", RecordSchema);