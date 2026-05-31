import { Request, Response, NextFunction } from "express";
import { createTemple, getTemple } from "./temple.service";
import { CreateTempleDto } from "./temple.validator";
import { successResponse } from "@/utils/response";
import { HTTP_CODES, MESSAGE } from "@/constants";

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
