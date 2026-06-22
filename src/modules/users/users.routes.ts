import { Router } from "express";
import {
  createUserController,
  forceDeleteUserController,
  getUsersController,
  meController,
  restoreDeletedUserController,
  softDeleteUserController,
  updateUserController,
  updateUserEmailController,
  updateUserPasswordController,
  verifyEmailController,
} from "./users.controller";
import {
  CreateUserSchema,
  UpdateUserPassSchema,
  UpdateUserSchema,
  UserIdSchema,
  UserEmailSchema,
  TokenSchema,
} from "./users.validator";
import {
  validate,
  authMiddleware,
  allowRoles,
  auditMiddleware,
} from "@/middleware";
import { ROLES } from "@/constants";
import { asyncHandler } from "@/utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * /user:
 *    post:
 *        summary: Create new user
 *        description:
 *        tags:
 *          - Users
 *
 *        requestBody:
 *          required: true
 *          description: Data required to create user
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  required:
 *                      - firstName
 *                      - lastName
 *                      - username
 *                      - email
 *                      - password
 *                  properties:
 *                     firstName:
 *                      type: string
 *                      example: Vedant
 *                     lastName:
 *                      type: string
 *                      example: Kale
 *                     username:
 *                      type: string
 *                      example: vedant1
 *                     email:
 *                      type: string
 *                      example: vedant@gmail.com
 *                     password:
 *                      type: string
 *                      example: password
 *        responses:
 *             201:
 *                 description: User created successfully
 *             400:
 *                 description: Invalid input data
 *             409:
 *                 description: conflict
 */
router.post(
  "/",
  validate(CreateUserSchema),
  auditMiddleware("POST", "USER"),
  asyncHandler(createUserController),
);
/**
 * @swagger
 * /user:
 *    get:
 *       summary: Get all users
 *       tags:
 *          - Users
 *       security:
 *               - bearerAuth: []
 *       responses:
 *            200:
 *                description: success
 *            401:
 *                description: unauthorized
 *            409:
 *                description: conflict
 */
router.get(
  "/",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
  auditMiddleware("GET", "USER"),
  asyncHandler(getUsersController),
);
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       409:
 *         description: User is already deleted
 */
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER),
  validate(UserIdSchema, "params"),
  auditMiddleware("DELETE", "USER"),
  asyncHandler(softDeleteUserController),
);
/**
 * @swagger
 * /user/{id}/force:
 *   delete:
 *     summary: Force delete user
 *     description: Delete a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to force delete
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 *       409:
 *         description: User is already deleted
 */
router.delete(
  "/:id/force",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN),
  validate(UserIdSchema, "params"),
  auditMiddleware("DELETE", "USER"),
  asyncHandler(forceDeleteUserController),
);
/**
 * @swagger
 * /user/{id}/restore:
 *   patch:
 *     summary: Restore deleted user
 *     description: Delete a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to restore
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     responses:
 *       200:
 *         description: User restored successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.patch(
  "/:id/restore",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN),
  validate(UserIdSchema, "params"),
  auditMiddleware("PATCH", "USER"),
  asyncHandler(restoreDeletedUserController),
);
/**
 * @swagger
 * /user/{id}:
 *   patch:
 *     summary: Update user
 *     description: Update a user by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     responses:
 *       200:
 *         description: User restored successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.patch(
  "/:id",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER),
  validate(UserIdSchema, "params"),
  validate(UpdateUserSchema, "body"),
  auditMiddleware("PATCH", "USER"),
  asyncHandler(updateUserController),
);
/**
 * @swagger
 * /user/{id}/reset-password:
 *   patch:
 *     summary: Reset user password
 *     description: Update user password by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update password
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     requestBody:
 *       required: true
 *       description: Data required to update user password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: password
 *               newPassword:
 *                 type: string
 *                 example: password1
 *     responses:
 *       200:
 *         description: User password updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 */
router.patch(
  "/:id/reset-password",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER),
  validate(UserIdSchema, "params"),
  validate(UpdateUserPassSchema, "body"),
  auditMiddleware("PATCH", "USER"),
  asyncHandler(updateUserPasswordController),
);
/**
 * @swagger
 * /user/{id}/email:
 *   patch:
 *     summary: Update user email
 *     description: Update user email by ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update email
 *         schema:
 *           type: string
 *           example: 69b949dfff298568ede44b43
 *     requestBody:
 *       required: true
 *       description: Data required to update user email
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: vedant@gmail.com
 *     responses:
 *       200:
 *         description: User email updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - authentication required
 *       409:
 *         description: Email already exists
 */
router.patch(
  "/:id/email",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER),
  validate(UserIdSchema, "params"),
  validate(UserEmailSchema, "body"),
  auditMiddleware("PATCH", "USER"),
  asyncHandler(updateUserEmailController),
);
/**
 * @swagger
 * /verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email using the token sent via email
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email verification token
 *         schema:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get(
  "/verify-email/:token",
  validate(TokenSchema, "params"),
  auditMiddleware("GET", "USER"),
  asyncHandler(verifyEmailController),
);
/**
 * @swagger
 * /user/me:
 *    get:
 *        summary: Self fetch
 *        description: Fetch your own account details
 *        tags:
 *          - Users
 *        security:
 *          - bearerAuth: []
 *        responses:
 *             200:
 *                 description: Self fetch successful
 *             401:
 *                 description: Unauthorized
 *             500:
 *                 description: Internal server error
 */
router.get(
  "/me",
  authMiddleware,
  allowRoles(ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER),
  auditMiddleware("GET", "USER"),
  asyncHandler(meController),
);

export default router;
