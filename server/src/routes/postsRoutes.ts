import { Router } from "express";
import {
  deletePost,
  getAllPosts,
  getNonPublishedPostsByUserId,
  getPostById,
  getPostsByTag,
  getPostsByUserId,
  getUsersLikedPosts,
  likeAPost,
  publishPost,
  unlikeAPost,
  unpublishPost,
  updatePost,
} from "../controllers/postController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.get("/unpublished/:userId", authenticateToken, getNonPublishedPostsByUserId);
router.get("/user/:userId", getPostsByUserId);
router.put("/publish/:postId", authenticateToken, publishPost);
router.put("/unpublish/:postId", authenticateToken, unpublishPost);
router.delete("/:postId/:userId", authenticateToken, deletePost);
router.put("/like/:postId", authenticateToken, likeAPost);
router.put("/unlike/:postId", authenticateToken, unlikeAPost);
router.get("/liked-posts/:userId", authenticateToken, getUsersLikedPosts);
router.get('/tag/:tag', getPostsByTag);
router.put("/:postId", authenticateToken, updatePost);


export default router;
