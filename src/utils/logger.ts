import pino from "pino";

export const logger = pino(
  {
    level: process.env.LOG_LEVEL ?? "info",
  },

  pino.transport({
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: false,
      ignore: "responseTime",
    },
  }),
);
