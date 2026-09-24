import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { clerkWebhook } from "./controllers/clerkWebhookController.js"; // NEW

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://shinespec.com",
    "https://www.shinespec.com",
    "https://shinespec-web-git-main-shinespecs-projects.vercel.app",
    "https://shinespec-web-frontend-git-main-shinespecs-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// IMPORTANT: Clerk webhook needs the raw body for signature verification —
// register it BEFORE express.json()
app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workers", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/payments/payfast/webhook", (req, res) => {
  import("./controllers/paymentController.js").then(module => {
    module.payfastWebhook(req, res);
  });
});

app.get("/", (req, res) => {
  res.send("ShineSpec Backend API is running");
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected successfully");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});