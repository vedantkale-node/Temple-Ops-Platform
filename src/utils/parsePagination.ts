import { HTTP_CODES, MESSAGE } from "@/constants";
import { AppError } from "@/errors/AppError";

export const parsePagination = (pageQuery: unknown, limitQuery: unknown) => {
  const page = pageQuery ? Number(pageQuery) : 1;
  const limit = limitQuery ? Number(limitQuery) : 1;

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    throw new AppError(
      MESSAGE.COMMON.INVALID_PAGINATION_PARAMS,
      HTTP_CODES.BAD_REQUEST,
    );
  }

  return { page, limit };
};
