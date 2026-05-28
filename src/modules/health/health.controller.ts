import { env } from "@/config";
import { HTTP_CODES, MESSAGE } from "@/constants";
import { successResponse } from "@/utils";
import { formatUptime } from "@/utils/formatUptime";
import { Request, Response } from "express";

type HealthInfo = {
  timestamp: string;
  uptime: string;
  environment: string;
};

export const healthController = (req: Request, res: Response) => {
  try {
    const info: HealthInfo = {
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
      environment: env.NODE_ENV || "development",
    };
    return successResponse(res, HTTP_CODES.OK, MESSAGE.SERVER.HEALTH_OK, info);
  } catch (error) {
    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGE.SERVER.HEALTH_FAILED,
    });
  }
};
