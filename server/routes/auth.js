import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "../db.js";
import { signToken, requireAuth } from "../auth.js";

const router = Router();
const emailOk = (e) => typeof e === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !emailOk(email) || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your name, a valid email, and a password." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  const normalized = email.trim().toLowerCase();
  if (db.find("users", (u) => u.email === normalized)) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }
  const user = db.insert("users", {
    name: name.trim(),
    email: normalized,
    passwordHash: await bcrypt.hash(password, 10),
  });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = typeof email === "string" && db.find("users", (u) => u.email === email.trim().toLowerCase());
  const ok = user && typeof password === "string" && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: "Incorrect email or password." });
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get("/me", requireAuth, (req, res) => {
  const user = db.find("users", (u) => u.id === req.userId);
  if (!user) return res.status(401).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
});

export default router;
