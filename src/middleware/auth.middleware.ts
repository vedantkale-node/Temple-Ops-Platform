import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.config";
import {HTTP_CODES, MESSAGE} from "@/constants";
import { AppError } from "@/errors/AppError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookieToken = req.cookies?.token;
    const header = req.get("authorization");
    const headerToken = header?.startsWith("Bearer ")
      ? header.substring(7)
      : null;

    const token = cookieToken || headerToken;
    if (!token) {
      throw new AppError("Token missing", HTTP_CODES.UNAUTHORIZED);
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError(MESSAGE.AUTH.INVALID_TOKEN, HTTP_CODES.UNAUTHORIZED));
    }
    return next(error);
  }
};
