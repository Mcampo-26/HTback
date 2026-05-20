import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    idConteo: {
      type: String,
      required: true,
      unique: true, // Crucial para garantizar que no existan duplicados
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Counter = mongoose.model("Counter", CounterSchema);