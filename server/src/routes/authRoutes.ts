import { Router } from "express";
import {
  checkUsernameAvailability,
  createUser,
  getMe,
  loginUser,
  logoutUser,
  sayHiToUser,
} from "../controllers/authController";
import { authenticateToken, authenticateTokenInitializeUser } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/sayhi", sayHiToUser);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateTokenInitializeUser, getMe);
router.get("/logout", logoutUser)
router.get("/usernameavailability/:username", checkUsernameAvailability);

export default router;
