import { Router } from "express";
import {
  loginPage,
  loginPost,
  homePage,
  logoutPost,
  signUpPage,
  signUpPost,
  settingsPage,
  profilePage,
  deleteUser,
  logsPage,
} from "./web.controller";
import { allowRoles, WebAuthMiddleware } from "@/middleware";
import { redirectIfAuth } from "@/middleware/redirectIfAuth.middleware";
import { ROLES } from "@/constants";
import { authLimiter } from "@/config";

const router = Router();

router.get("/", WebAuthMiddleware, homePage);

router.get("/login", redirectIfAuth, loginPage);
router.post("/login", authLimiter, loginPost);
router.post("/logout", logoutPost);

router.get(
  "/signup",
  WebAuthMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPERADMIN),
  signUpPage,
);
router.post(
  "/signup",
  WebAuthMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPERADMIN),
  signUpPost,
);

router.get(
  "/profile",
  WebAuthMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.USER),
  profilePage,
);

router.get(
  "/settings",
  WebAuthMiddleware,
  allowRoles(ROLES.SUPERADMIN),
  settingsPage,
);

router.delete(
  "/delete",
  WebAuthMiddleware,
  allowRoles(ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.USER),
  deleteUser,
);

router.get("/logs", WebAuthMiddleware, allowRoles(ROLES.SUPERADMIN), logsPage);

export default router;
