// src/models/counter.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    idConteo: {
      type: String,
      required: true,
      unique: true, // 👈 Bloqueo total a nivel Driver de Mongo
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Counter = mongoose.model("Counter", CounterSchema);

// 🔥 GOLPE DE EFECTO: Asegura que el índice 'unique' se registre sí o sí en Atlas
Counter.syncIndexes().catch((err) => 
  console.error("[MONGO INDEX ERROR]:", err.message)
);