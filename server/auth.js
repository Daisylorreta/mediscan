import jwt from "jsonwebtoken";

const secret = () => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return process.env.JWT_SECRET;
};

export const signToken = (user) =>
  jwt.sign({ sub: user.id }, secret(), { expiresIn: "7d" });

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not signed in." });
  try {
    req.userId = jwt.verify(token, secret()).sub;
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}
