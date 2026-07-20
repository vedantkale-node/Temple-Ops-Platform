import { RequestHandler } from "express";

export const asyncHandler = <P>(fn: RequestHandler<P>): RequestHandler<P> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
