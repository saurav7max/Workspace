import jwt from "jsonwebtoken";

const JWT_SECRET = "super-secret-key"; // later move to env
const JWT_EXPIRES_IN = "1h";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
