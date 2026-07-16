import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.config";
import { AppError } from "@/errors/AppError";
import { HTTP_CODES, MESSAGE } from "@/constants";

export const WebAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookieToken = req.cookies?.token;
    const header = req.get("authorization");
    const headerToken = header?.startsWith("Bearer ")
      ? header.split(" ")[1]
      : null;

    const token = cookieToken || headerToken;
    if (!token) {
      return res.redirect("/login");
    }
    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (typeof decoded === "string") {
      throw new AppError(MESSAGE.AUTH.INVALID_TOKEN, HTTP_CODES.UNAUTHORIZED);
    }
    req.user = decoded;
    return next();
  } catch {
    res.clearCookie("token");
    return res.redirect("/login");
  }
};
