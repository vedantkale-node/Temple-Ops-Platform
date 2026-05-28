import express from "express";
import { errorHandler } from "@/middleware";
import dns from "node:dns";
import apiRouter from "@/router/router";
import webRouter from "@/modules/web/web.routes";
import authRouter from "@/modules/auth/auth.routes";
import {
  apiLimiter,
  env,
  globalLimiter,
  getSwaggerSpec,
  authLimiter,
} from "@/config";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";
import compression from "compression";
import swaggerUI from "swagger-ui-express";
import { engine } from "express-handlebars";
import path from "node:path";
import session from "express-session";
import flash from "connect-flash";
import { notFound } from "./middleware/notFound.middleware";
import { healthController } from "./modules/health/health.controller";

dns.setServers(["8.8.8.8", "8.8.4.4"]); // TEMP WORKAROUND, REMOVE LATER

const app = express();
const baseUrl: string = env.BASE_URL;
const swaggerSpec = getSwaggerSpec();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(
  cors({
    origin: [baseUrl],
    credentials: true,
  }),
);
app.use(hpp());
app.use(compression());
app.use(globalLimiter);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());
app.use(express.json({ limit: "10kb" }));
app.use(
  express.static(path.resolve("public"), {
    maxAge: "7d",
    etag: true,
  }),
);
app.engine(
  "handlebars",
  engine({
    helpers: {
      formatDate(date) {
        return new Date(date).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      },

      ifEquals(a: unknown, b: unknown, options: Handlebars.HelperOptions) {
        return a === b ? options.fn(this) : options.inverse(this);
      },
    },
  }),
);
app.set("trust proxy", 1);
app.set("view engine", "handlebars");
app.set("views", path.resolve("src", "views"));

if (env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

app.use("/api/auth", authLimiter, authRouter);
app.use("/api", apiLimiter, apiRouter);
app.use("/health", apiLimiter, healthController);
app.use("/", webRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
