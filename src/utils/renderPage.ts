import { Request, Response } from "express";

type RenderOptions = Record<string, unknown>;

export function renderHTMX(
  req: Request,
  res: Response,
  view: string,
  options: RenderOptions = {},
  layout: string = "dashboard",
) {
  const isHTMX = req.headers["hx-request"];
  return res.render(view, {
    ...options,
    layout: isHTMX ? false : layout,
  });
}
