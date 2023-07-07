import { Router } from "express";
import {
  bookmarkAPost,
  followAUser,
  getSuggestedUsers,
  getUserById,
  getUserByUsername,
  getUsersBookmarkedPosts,
  getUsersFollowers,
  getUsersFollowings,
  unFollowAUser,
  unbookmarkAPost,
  updateUser,
} from "../controllers/userController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/username/:username", getUserByUsername)
router.get("/:userId", getUserById);
router.put("/:userId", authenticateToken, updateUser);
router.put("/follow/:currentUserId", authenticateToken, followAUser);
router.put("/unfollow/:currentUserId", authenticateToken, unFollowAUser);
router.get("/followings/:userId", getUsersFollowings);
router.get("/followers/:userId", getUsersFollowers);
router.put("/bookmark/:userId", authenticateToken, bookmarkAPost);
router.put("/unbookmark/:userId", authenticateToken, unbookmarkAPost);
router.get(
  "/bookmarked-posts/:userId",
  authenticateToken,
  getUsersBookmarkedPosts
);
router.get("/users/suggestions", getSuggestedUsers);

export default router;
