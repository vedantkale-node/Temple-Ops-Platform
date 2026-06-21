import { NextFunction, Request, Response } from "express";
import { getAuditLogs } from "./audit.service";
import { successResponse } from "@/utils/response";
import { HTTP_CODES } from "@/constants/httpCodes";
import { AppError } from "@/errors/AppError";
import { MESSAGE } from "@/constants";
import { parsePagination } from "@/utils/parsePagination";

export const getAuditLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = parsePagination(req.query.page, req.query.limit);
    const result = await getAuditLogs(page, limit);
    successResponse(res, HTTP_CODES.OK, "Audit logs fetched", result);
  } catch (error) {
    next(error);
  }
};
