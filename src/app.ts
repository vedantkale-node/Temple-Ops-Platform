import express, { NextFunction, Request, Response, urlencoded } from "express";
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

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const baseUrl: string = env.BASE_URL;

app.use(globalLimiter);
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: [baseUrl],
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(hpp());
app.use(express.static(path.resolve("public")));
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

      ifEquals(a: any, b: any, options: any) {
        return a === b ? options.fn(this) : options.inverse(this);
      },
    },
  }),
);
app.set("view engine", "handlebars");
app.set("views", path.resolve("src", "views"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(flash());

if (env.NODE_ENV !== "production") {
  app.use(
    "/api-docs",
    swaggerUI.serve,
    (req: Request, res: Response, next: NextFunction) => {
      const handler = swaggerUI.setup(getSwaggerSpec());
      return handler(req, res, next);
    },
  );
}

app.use("/api/auth", authLimiter, authRouter);
app.use("/api", apiLimiter, apiRouter);
app.use("/", globalLimiter, webRouter);
app.use(notFound);
app.use(errorHandler);

export default app;
