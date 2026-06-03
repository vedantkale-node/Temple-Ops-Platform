import { Router } from "express";
import {
  SevekariIdSchema,
  SevekariSchema,
  UpdateSevekariSchema,
} from "./sevekari.validator";
import {
  validate,
  auditMiddleware,
  authMiddleware,
  allowRoles,
} from "@/middleware";
import * as controller from "@/modules/sevekari/sevekari.controller";
import { ROLES } from "@/constants";

const router = Router();

/**
 * @swagger
 * /sevekari:
 *   post:
 *     summary: Create new sevekari
 *     description: Creating new sevekari
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Data required to create sevekari
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - middleName
 *               - lastName
 *               - mobile
 *               - mobileAlt
 *               - email
 *               - address
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Vedant
 *               middleName:
 *                 type: string
 *                 example: Suresh
 *               lastName:
 *                 type: string
 *                 example: Kale
 *               mobile:
 *                 type: string
 *                 example: 0011223344
 *               mobileAlt:
 *                 type: string
 *                 example: 5566778899
 *               email:
 *                 type: string,
 *                 example: vedant@mail.com
 *               address:
 *                 type: string,
 *                 example: xyz123456789
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post(
  "/",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
  validate(SevekariSchema),
  auditMiddleware("POST", "SEVEKARI"),
  controller.createSevekariController,
);

/**
 * @swagger
 * /sevekari:
 *   get:
 *     summary: get all sevekari
 *     description: get all sevekari
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched sevekari
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
  auditMiddleware("GET", "SEVEKARI"),
  controller.getSevekariController,
);

/**
 * @swagger
 * /sevekari/{id}:
 *   patch:
 *     summary: Update sevekari
 *     description: Update sevekari with id
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sevekari to update
 *         schema:
 *           type: string
 *           example: 69ccab094b480eb596d86107
 *     requestBody:
 *       required: true
 *       description: Data required to create user
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - username
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Vedant
 *               middleName:
 *                 type: string,
 *                 example: Suresh
 *               lastName:
 *                 type: string
 *                 example: Kale
 *               email:
 *                 type: string
 *                 example: vedant@gmail.com
 *               mobile:
 *                 type: string
 *                 example: 1234567890
 *               mobileAlt:
 *                 type: string
 *                 example: 0987654321
 *               address:
 *                 type: string
 *                 example: xyzjsdklfjalfj
 *     responses:
 *       200:
 *         description: Sevekari updated successfully
 *       400:
 *         description: Invalid sevekari id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sevekari not found
 *       500:
 *         description: Internal server error
 */

router.patch(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPERADMIN),
  validate(SevekariIdSchema, "params"),
  validate(UpdateSevekariSchema, "body"),
  auditMiddleware("PATCH", "SEVEKARI"),
  controller.updateSevekariController,
);

/**
 * @swagger
 * /sevekari/{id}:
 *   delete:
 *     summary: Soft delete sevekari
 *     description: Soft delete sevekari with id
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sevekari to soft delete
 *         schema:
 *           type: string
 *           example: 69c5124bb792af3f448a473f
 *     responses:
 *       200:
 *         description: Sevekari deleted successfully
 *       400:
 *         description: Invalid sevekari id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sevekari not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
  validate(SevekariIdSchema),
  auditMiddleware("DELETE", "SEVEKARI"),
  controller.softDeleteSevekariController,
);

/**
 * @swagger
 * /sevekari/{id}/restore:
 *   patch:
 *     summary: restore soft deleted sevekari
 *     description: restore soft deleted sevekari with id
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sevekari to force delete
 *         schema:
 *           type: string
 *           example: 69c5124bb792af3f448a473f
 *     responses:
 *       200:
 *         description: Sevekari restored successfully
 *       400:
 *         description: Invalid sevekari id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sevekari not found
 *       500:
 *         description: Internal server error
 */

router.patch(
  "/:id/restore",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN),
  validate(SevekariIdSchema),
  auditMiddleware("PATCH", "SEVEKARI"),
  controller.restoreSoftDeletedSevekariController,
);

/**
 * @swagger
 * /sevekari/{id}/force:
 *   delete:
 *     summary: Force delete sevekari
 *     description: Force delete sevekari with id
 *     tags:
 *       - Sevekari
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sevekari to force delete
 *         schema:
 *           type: string
 *           example: 69c5124bb792af3f448a473f
 *     responses:
 *       200:
 *         description: Sevekari deleted successfully
 *       400:
 *         description: Invalid sevekari id
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Sevekari not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id/force",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN),
  validate(SevekariIdSchema),
  auditMiddleware("DELETE", "SEVEKARI"),
  controller.forceDeleteSevekariController,
);

export default router;
