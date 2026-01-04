import { Request, Response } from "express";
import { authenticate } from "../services/auth.service";
import { generateToken } from "../utils/jwt";

export function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = authenticate(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  res.json({ 
    token,
    user: {
      id: user.id,
      email: user.email
    }
  });
}

export function me(req: Request, res: Response) {
  // User is available from auth middleware
  const user = (req as any).user;
  
  res.json({
    id: user.userId,
    email: user.email
  });
}
