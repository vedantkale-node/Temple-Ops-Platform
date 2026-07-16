import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { HTTP_CODES } from "@/constants";

export const validate = (
  schema: ZodSchema,
  source: "body" | "params" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (err: unknown) {
      if (!(err instanceof ZodError)) {
        throw err;
      }

      const formatted = err.issues.reduce(
        (acc: Record<string, string>, issue) => {
          acc[String(issue.path[0])] = issue.message;
          return acc;
        },
        {},
      );

      return res.status(HTTP_CODES.BAD_REQUEST).json({
        message: "Validation failed",
        errors: formatted,
      });
    }
  };
};
