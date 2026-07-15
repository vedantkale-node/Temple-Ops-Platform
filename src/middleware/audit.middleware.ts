import { Request, Response, NextFunction } from "express";
import { AuditLog } from "@/modules/audit/audit.model";
import { logger } from "@/utils";
import { MESSAGE } from "@/constants";

export const auditMiddleware = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.on("finish", async () => {
      try {
        await AuditLog.create({
          userId: req.user?.id,
          role: req.user?.role,
          action,
          resource,
          resourceId: req.params?.id,
          method: req.method,
          url: req.originalUrl,
          ip: req.ip,
        });
      } catch (error) {
        logger.warn(
          { error, action, resource, url: req.originalUrl },
          MESSAGE.AUDIT.AUDIT_LOG_WRITE_FAILED,
        );
      }
    });
    next();
  };
};
