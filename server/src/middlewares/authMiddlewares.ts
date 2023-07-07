import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { INVALID_TOKEN, TOKEN_NOT_FOUND } from "../utils/errorTypes";

configDotenv();

export const authenticateTokenToInitializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({
        success: false,
        message: "Token not found",
        errorType: TOKEN_NOT_FOUND,
      });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res
        .status(403)
        .json({
          success: false,
          message: "Invalid token",
          errorType: INVALID_TOKEN,
        });
      return;
    }
    req.body = { user, ...req.body };
    next();
  });
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({
        success: false,
        message: "Token not found",
        errorType: TOKEN_NOT_FOUND,
      });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res
        .status(403)
        .json({
          success: false,
          message: "Invalid token",
          errorType: INVALID_TOKEN,
        });
      return;
    }
    next();
  });
};
