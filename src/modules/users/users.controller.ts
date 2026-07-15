import { NextFunction, Request, Response } from "express";
import * as userService from "./users.service";
import mongoose from "mongoose";
import { HTTP_CODES, MESSAGE, ROLES } from "@/constants";
import { successResponse } from "@/utils";
import { AppError } from "@/errors/AppError";
import { parsePagination } from "@/utils/parsePagination";

export const createUserController = async (req: Request, res: Response) => {
  const payload = req.body;
  const user = await userService.createUser(payload);
  successResponse(res, HTTP_CODES.CREATED, MESSAGE.USER.USER_CREATED, user);
};

export const getUsersController = async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query.page, req.query.limit);

  const result = await userService.getUsers(page, limit);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_FETCHED, result);
};

export const softDeleteUserController = async (req: Request, res: Response) => {
  const userId = req.params.id as string;
  const actor = req.user;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);
  }
  if (actor.role === ROLES.USER && actor.id !== userId) {
    throw new AppError(
      MESSAGE.USER.CANNOT_DELETE_OTHER_USER,
      HTTP_CODES.FORBIDDEN,
    );
  }
  await userService.softDeleteUser(userId);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_DELETED);
};

export const forceDeleteUserController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.params.id as string;
  const actor = req.user;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);
  }
  if (actor.role === ROLES.USER && actor.id !== userId) {
    throw new AppError(
      MESSAGE.USER.CANNOT_DELETE_OTHER_USER,
      HTTP_CODES.FORBIDDEN,
    );
  }
  await userService.forceDeleteUser(userId);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_DELETED);
};

export const restoreDeletedUserController = async (
  req: Request,
  res: Response,
) => {
  const userId = req.params.id as string;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);
  }
  const user = await userService.restoreDeletedUser(userId);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_RESTORED, user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.params.id as string;
  const actor = req.user;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);
  }
  if (actor.role === ROLES.USER && actor.id !== userId) {
    throw new AppError(
      MESSAGE.USER.YOU_CAN_ONLY_UPDATE_YOUR_OWN_PROFILE,
      HTTP_CODES.FORBIDDEN,
    );
  }
  const user = await userService.updateUser(userId, payload, actor.role);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_UPDATED, user);
};

export const updateUserPasswordController = async (
  req: Request,
  res: Response,
) => {
  const id = req.params.id as string;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const actor = req.user;

  if (actor.role === ROLES.USER && actor.id !== id)
    throw new AppError(
      MESSAGE.USER.YOU_CAN_ONLY_SET_YOUR_OWN_PASSWORD,
      HTTP_CODES.FORBIDDEN,
    );

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);

  const result = await userService.updateUserPass(
    id,
    oldPassword,
    newPassword,
    actor.role,
  );

  successResponse(
    res,
    HTTP_CODES.OK,
    MESSAGE.USER.USER_PASSWORD_RESET_SUCCESSFUL,
    result,
  );
};

export const updateUserEmailController = async (
  req: Request,
  res: Response,
) => {
  const id = req.params.id as string;
  const email = req.body.email;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(MESSAGE.USER.INVALID_USER_ID, HTTP_CODES.BAD_REQUEST);
  }

  const result = await userService.updateUserEmail(
    id,
    email,
    req.user.role,
    req.user.id,
  );

  successResponse(
    res,
    HTTP_CODES.OK,
    MESSAGE.USER.USER_EMAIL_UPDATED_SUCCESSFUL,
    result,
  );
};

export const verifyEmailController = async (req: Request, res: Response) => {
  const token = req.params.token as string;
  await userService.verifyEmail(token);
  successResponse(
    res,
    HTTP_CODES.OK,
    MESSAGE.USER.EMAIL_VERIFICATION_SUCCESSFUL,
  );
};

export const meController = async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await userService.me(id);
  successResponse(res, HTTP_CODES.OK, MESSAGE.USER.USER_FETCHED, result);
};
