import { Request, Response, NextFunction } from "express";
import { logger } from "@/utils/logger";
import { HTTP_CODES } from "@/constants";
import { AppError } from "@/errors/AppError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error(err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    return res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (err.name === "CastError") {
    return res.status(HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: `Invalid ${err.path}`,
    });
  }
  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Something went wrong" });
};
