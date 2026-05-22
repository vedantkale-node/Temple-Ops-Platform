import { AuditLog } from "./audit.model";

export const getAuditLogs = async (page: number, limit: number) => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.max(limit, 1);
  const skip = (safePage - 1) * safeLimit;

  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit)
    .lean();

  const total = await AuditLog.countDocuments();
  const pages = Math.ceil(total / safeLimit);
  return { logs, pages, page: safePage, total };
};
