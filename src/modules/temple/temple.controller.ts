import { Request, Response, NextFunction } from "express";
import { createTemple, getTemple, deleteTemple } from "./temple.service";
import { CreateTempleDto } from "./temple.validator";
import { successResponse } from "@/utils/response";
import { HTTP_CODES, MESSAGE } from "@/constants";
import mongoose from "mongoose";
import { AppError } from "@/errors/AppError";
import { parsePagination } from "@/utils/parsePagination";

export const createTempleController = async (req: Request, res: Response) => {
  const payload: CreateTempleDto = req.body;
  const result = await createTemple(payload);
  successResponse(
    res,
    HTTP_CODES.CREATED,
    MESSAGE.TEMPLE.TEMPLE_CREATED,
    result,
  );
};

export const deleteTempleController = async (req: Request, res: Response) => {
  const templeId = req.params.id as string;
  if (!mongoose.Types.ObjectId.isValid(templeId)) {
    throw new AppError(
      MESSAGE.TEMPLE.INVALID_TEMPLE_ID,
      HTTP_CODES.BAD_REQUEST,
    );
  }
  await deleteTemple(templeId);
  successResponse(res, HTTP_CODES.OK, MESSAGE.TEMPLE.TEMPLE_DELETED);
};

export const getTempleController = async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query.page, req.query.limit);
  const result = await getTemple(page, limit);
  successResponse(res, HTTP_CODES.OK, MESSAGE.TEMPLE.TEMPLE_FETCHED, result);
};
