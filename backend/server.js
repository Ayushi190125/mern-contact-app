import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import recordRoutes from "./src/routes/recordRoutes.js";
import metaRoutes from "./src/routes/metaRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// DB
await connectDB();

// Routes
app.use("/api/records", recordRoutes);
app.use("/api/meta", metaRoutes);

app.get("/", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));