import { Router } from "express";
import {
  createUser,
  getMe,
  loginUser,
  sayHiToUser,
} from "../controllers/authController";
import { authenticateTokenToInitializeUser } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/sayhi", sayHiToUser);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateTokenToInitializeUser, getMe);

export default router;
