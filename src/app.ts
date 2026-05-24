import express, { NextFunction, Request, Response, urlencoded } from "express";
import dns from "node:dns";
import path from "node:path";

import compression from "compression";
import connectFlash from "connect-flash";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import { engine } from "express-handlebars";
import helmet from "helmet";
import hpp from "hpp";
import swaggerUI from "swagger-ui-express";

import {
  apiLimiter,
  authLimiter,
  env,
  getSwaggerSpec,
  globalLimiter,
} from "@/config";

import { errorHandler } from "@/middleware";
import { notFound } from "@/middleware/notFound.middleware";

import authRouter from "@/modules/auth/auth.routes";
import webRouter from "@/modules/web/web.routes";
import apiRouter from "@/router/router";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

const { BASE_URL, NODE_ENV, SESSION_SECRET = "super-secret-session" } = env;

const isProduction = NODE_ENV === "production";

app.disable("x-powered-by");

app.engine(
  "handlebars",
  engine({
    helpers: {
      formatDate(date: Date | string) {
        return new Intl.DateTimeFormat("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(date));
      },

      ifEquals(a: unknown, b: unknown, options: any) {
        return a === b ? options.fn(this) : options.inverse(this);
      },

      truncate(text: string, length = 100) {
        if (!text) return "";
        return text.length > length ? `${text.slice(0, length)}...` : text;
      },
    },
  }),
);

app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));

app.use(globalLimiter);

app.use(
  cors({
    origin: [BASE_URL],
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(compression());
app.use(hpp());

app.use(express.static(path.resolve("public")));

app.use(urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.use(
  session({
    name: "sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use(connectFlash());

if (!isProduction) {
  app.use(
    "/api-docs",
    swaggerUI.serve,
    (req: Request, res: Response, next: NextFunction) => {
      return swaggerUI.setup(getSwaggerSpec())(req, res, next);
    },
  );
}

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    uptime: process.uptime(),
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authLimiter, authRouter);
app.use("/api", apiLimiter, apiRouter);
app.use("/", webRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
