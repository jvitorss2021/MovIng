import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
}

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as AuthenticatedRequest).user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido" });
    return;
  }
}; 