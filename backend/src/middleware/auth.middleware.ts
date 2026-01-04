import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Check if header follows "Bearer <token>" format
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = authHeader.split(" ")[1];

  // Additional check to ensure token exists
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
