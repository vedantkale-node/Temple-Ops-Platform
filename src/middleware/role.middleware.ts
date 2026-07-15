import { Request, Response, NextFunction } from "express";
import { HTTP_CODES } from "@/constants";

export const allowRoles =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res
        .status(HTTP_CODES.UNAUTHORIZED)
        .json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(HTTP_CODES.FORBIDDEN)
        .json({ success: false, message: "Forbidden" });
    }

    next();
  };
