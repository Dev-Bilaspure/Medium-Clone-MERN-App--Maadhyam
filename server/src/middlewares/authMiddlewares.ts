import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { INVALID_TOKEN, TOKEN_NOT_FOUND } from "../utils/errorTypes";

configDotenv();

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Token not found",
      errorType: TOKEN_NOT_FOUND,
    });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }).status(403).json({
        success: false,
        message: "Invalid token",
        errorType: INVALID_TOKEN,
      });
      return;
    }
    next();
  });
};



export const authenticateTokenInitializeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Token not found",
      errorType: TOKEN_NOT_FOUND,
    });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }).status(403).json({
        success: false,
        message: "Invalid token",
        errorType: INVALID_TOKEN,
      });
      return;
    }
    req.body.authorizedUser = user;
    next();
  });
};