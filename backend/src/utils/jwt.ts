import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  JWT_SECRET not set in environment variables. Using fallback secret.");
}

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
