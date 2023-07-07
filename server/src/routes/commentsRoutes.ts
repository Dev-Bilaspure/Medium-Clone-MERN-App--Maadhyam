import { Router } from "express";
import {
  createComment,
  deleteComment,
  getPostComments,
  likeAComment,
  unlikeAComment,
  updateComment,
} from "../controllers/commentController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = Router();

router.post("/", authenticateToken, createComment);
router.get("/post/:postId", getPostComments);
router.put("/:commentId", authenticateToken, updateComment);
router.delete("/:commentId/:userId", authenticateToken, deleteComment);
router.put("/like/:commentId", authenticateToken, likeAComment);
router.put("/unlike/:commentId", authenticateToken, unlikeAComment);

export default router;
