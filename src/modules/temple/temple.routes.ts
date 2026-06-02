import { Router } from "express";
import {
  createTempleController,
  deleteTempleController,
  getTempleController,
} from "./temple.controller";
import { CreateTempleSchema } from "./temple.validator";
import {
  authMiddleware,
  auditMiddleware,
  allowRoles,
  validate,
} from "@/middleware/";
import { ROLES } from "@/constants";
import { UserIdSchema } from "../users";

const router = Router();

/**
 * @swagger
 * /temple:
 *   post:
 *     summary: Add a temple
 *     description: Create a new temple
 *     tags:
 *       - Temple
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Data required to create a temple
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - city
 *               - branch
 *               - district
 *               - state
 *             properties:
 *               name:
 *                 type: string
 *                 example: Shri Hari Mandir
 *               city:
 *                 type: string
 *                 example: Nagpur
 *               branch:
 *                 type: string
 *                 example: 1
 *               district:
 *                 type: string
 *                 example: Nagpur
 *               state:
 *                 type: string
 *                 example: MH
 *     responses:
 *       201:
 *         description: Created temple successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validate(CreateTempleSchema),
  authMiddleware,
  auditMiddleware("POST", "TEMPLE"),
  allowRoles(ROLES.SUPERADMIN),
  createTempleController,
);

/**
 * @swagger
 * /temple/{id}:
 *   delete:
 *     summary: Delete temple
 *     description: Delete temple by id
 *     tags:
 *       - Temple
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the temple to delete
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     responses:
 *       200:
 *         description: Temple deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: Temple does not exist
 *       500:
 *         description: Internal server error
 */

router.delete(
  "/:id",
  authMiddleware,
  validate(UserIdSchema, "params"),
  auditMiddleware("DELETE", "TEMPLE"),
  allowRoles(ROLES.SUPERADMIN),
  deleteTempleController,
);

/**
 * @swagger
 * /temple:
 *   get:
 *     summary: Get all temples
 *     description: Get all temples with pagination
 *     tags:
 *       - Temple
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number (default = 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Limit (default = 10)
 *     responses:
 *       200:
 *         description: All temples fetched
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Conflict
 *       500:
 *         description: Internal server error
 */

router.get(
  "/",
  authMiddleware,
  auditMiddleware("GET", "TEMPLE"),
  allowRoles(ROLES.SUPERADMIN),
  getTempleController,
);

export default router;
