import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/config";

export const redirectIfAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    if (!token) return next();
    jwt.verify(token, env.JWT_SECRET);
    return res.redirect("/");
  } catch {
    res.clearCookie("token");
    return next();
  }
};
