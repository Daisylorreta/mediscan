import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import medicationRoutes from "./routes/medications.js";
import chatRoutes from "./routes/chat.js";
import { isDemo } from "./claude.js";

if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET. Copy .env.example to .env and fill it in.");
  process.exit(1);
}
if (isDemo()) {
  console.warn("Demo mode: no ANTHROPIC_API_KEY, so AI chat and photo scanning return sample answers.");
}

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, limit: 15, standardHeaders: true, legacyHeaders: false });

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/medications/scan", aiLimiter);
app.use("/api/medications", medicationRoutes);
app.use("/api/chat", aiLimiter, chatRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true, demo: isDemo() }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.message?.startsWith("Upload a")) return res.status(400).json({ error: err.message });
  if (err.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Image is too large (5 MB max)." });
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  if (status >= 500) console.error(err);
  const message = status === 503 ? err.message : status >= 500 ? "Something went wrong. Please try again." : err.message;
  res.status(status).json({ error: message });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`MediScan API running on http://localhost:${port}`));
