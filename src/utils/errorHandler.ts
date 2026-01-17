import { ErrorRequestHandler } from "express";
import ApiError from "./ApiError";
import {status} from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  } else {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
