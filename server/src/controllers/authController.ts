import { Request, Response } from "express";
import { loginUserSchema, signupUserSchema } from "../utils/validators";
import User from "../models/User";
import {
  createToken,
  hashPassword,
  verifyPassword,
} from "../utils/helperMethods";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS,
  RESOURCE_NOT_FOUND,
} from "../utils/errorTypes";

export const sayHiToUser = (req: Request, res: Response) => {
  res.json("Hi fller");
};

export const createUser = async (req: Request, res: Response) => {
  try {
    try {
      signupUserSchema.parse(req.body);
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          error,
          message: "Some fields are missing or invalid",
          errorType: BAD_REQUEST,
        });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res
        .status(409)
        .json({
          success: false,
          message: "Email already in user",
          errorType: BAD_REQUEST,
        });
      return;
    }

    req.body.username = req.body.email.split("@")[0];

    req.body.password = await hashPassword(req.body.password);
    const newUser = new User(req.body);

    const savedUser = await newUser.save();

    const token = createToken({ _id: savedUser._id, email: savedUser.email });

    res.status(201).json({
      success: true,
      token,
      message: "User registered successfully!",
      user: savedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error,
        errorType: INTERNAL_SERVER_ERROR,
      });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    try {
      loginUserSchema.parse(req.body);
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          error,
          message: "Some fields are missing or invalid",
          errorType: BAD_REQUEST,
        });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          errorType: RESOURCE_NOT_FOUND,
        });
      return;
    }

    const isPasswordValid = await verifyPassword(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      res
        .status(401)
        .json({
          success: false,
          message: "Invalid credentials",
          errorType: INVALID_CREDENTIALS,
        });
      return;
    }

    const token = createToken({ _id: user._id, email: user.email });
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token,
      user
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error,
        errorType: INTERNAL_SERVER_ERROR,
      });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.user.user.email });
    
    res.status(200).json({ success: true, user, message: "User found" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error,
        errorType: INTERNAL_SERVER_ERROR,
      });
  }
};
