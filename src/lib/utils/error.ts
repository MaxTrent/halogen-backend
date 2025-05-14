
import { NextFunction } from "express";
import ApiError from "../../common/api-error";

export const handleControllerError = (error: any, errorMessage: string, next: NextFunction) => {
  if (!(error instanceof ApiError)) {
    next(new ApiError(500, errorMessage));
  } else {
    next(error);
  }
};
