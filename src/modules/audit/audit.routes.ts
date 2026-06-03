import { Router } from "express";
import { ROLES } from "@/constants/roles";
import { auditMiddleware, authMiddleware, allowRoles } from "@/middleware";
import * as controller from "./audit.controller";

const router = Router();
/**
 * @swagger
 * /audit:
 *   get:
 *     summary: Get all audit logs
 *     tags:
 *       - Logs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched all logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

router.get(
  "/",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN),
  auditMiddleware("GET", "LOGS"),
  controller.getAuditLogsController,
);

export default router;
