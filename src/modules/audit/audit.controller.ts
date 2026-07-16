import { Request, Response } from "express";
import { getAuditLogs } from "./audit.service";
import { successResponse } from "@/utils/response";
import { HTTP_CODES } from "@/constants/httpCodes";
import { MESSAGE } from "@/constants";
import { parsePagination } from "@/utils/parsePagination";

export const getAuditLogsController = async (req: Request, res: Response) => {
  const { page, limit } = parsePagination(req.query.page, req.query.limit);
  const result = await getAuditLogs(page, limit);
  successResponse(res, HTTP_CODES.OK, MESSAGE.AUDIT.AUDIT_LOGS_FETCHED, result);
};
