import { Request, Response, NextFunction } from "express";
import { createTemple, getTemple, deleteTemple } from "./temple.service";
import { CreateTempleDto } from "./temple.validator";
import { successResponse } from "@/utils/response";
import { HTTP_CODES, MESSAGE } from "@/constants";
import mongoose from "mongoose";
import { AppError } from "@/errors/AppError";

export const createTempleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: CreateTempleDto = req.body;
    const result = await createTemple(payload);
    successResponse(
      res,
      HTTP_CODES.CREATED,
      MESSAGE.TEMPLE.TEMPLE_CREATED,
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteTempleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const templeId = req.params.id as string;
    if (!mongoose.Types.ObjectId.isValid(templeId)) {
      throw new AppError(
        MESSAGE.TEMPLE.INVALID_TEMPLE_ID,
        HTTP_CODES.BAD_REQUEST,
      );
    }
    await deleteTemple(templeId);
    successResponse(res, HTTP_CODES.OK, MESSAGE.TEMPLE.TEMPLE_DELETED);
  } catch (error) {
    next(error);
  }
};

export const getTempleController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await getTemple(page, limit);
    successResponse(res, HTTP_CODES.OK, MESSAGE.TEMPLE.TEMPLE_FETCHED, result);
  } catch (error) {
    next(error);
  }
};
