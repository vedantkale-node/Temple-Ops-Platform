import { NextFunction, Request, Response } from "express";
import { loginService } from "./auth.service";
import { HTTP_CODES, MESSAGE } from "@/constants";
import { successResponse } from "@/utils/response";
import { env, cookieOptions } from "@/config";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = await loginService(req.body);
  res.cookie("token", token, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000,
  });
  successResponse(res, HTTP_CODES.OK, MESSAGE.AUTH.LOGIN_SUCCESS);
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });
  successResponse(res, HTTP_CODES.OK, MESSAGE.AUTH.LOGOUT_SUCCESS);
};
