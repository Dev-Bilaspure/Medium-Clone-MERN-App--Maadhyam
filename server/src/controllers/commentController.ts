import { create } from "domain";
import { Request, Response } from "express";
import {
  createCommentSchema,
  likeUnlikeACommentSchema,
  updateCommentSchema,
} from "../utils/validators";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  UNAUTHORIZED,
} from "../utils/errorTypes";

export const createComment = async (req: Request, res: Response) => {
  try {
    try {
      createCommentSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        error,
        message: "Some fields are missing or invalid",
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { authorId, postId } = req.body;
    const user = await User.findById(authorId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const comment = new Comment({
      ...req.body,
      authorInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture || "somepic",
      },
    });

    await comment.save();

    res.status(201).json({
      success: true,
      comment: comment?.toObject(),
      message: "Comment created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    try {
      updateCommentSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        error,
        message: "Some fields are missing or invalid",
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { userId, content } = req.body;
    const { commentId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (comment.authorId.toString() !== userId.toString()) {
      res.status(401).json({
        success: false,
        message: "You can only update your own comments",
        errorType: UNAUTHORIZED,
      });
      return;
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    res.status(200).json({
      success: true,
      comment: updatedComment?.toObject(),
      message: "Comment updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (userId !== comment.authorId.toString()) {
      res.status(401).json({
        success: false,
        message: "You can only delete your own comments",
        errorType: UNAUTHORIZED,
      });
      return;
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    res.status(200).json({
      success: true,
      comment: deletedComment?.toObject(),
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(400).json({
        success: false,
        message: "Post id is required",
        errorType: BAD_REQUEST,
      });
      return;
    }

    const comments = await Comment.find({ postId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      comments: comments,
      message: "Comments fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const likeAComment = async (req: Request, res: Response) => {
  try {
    try {
      likeUnlikeACommentSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        error,
        message: "Some fields are missing or invalid",
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const isLiked = comment.likes.includes(userId);
    if (isLiked) {
      res.status(400).json({
        success: false,
        message: "Comment already liked",
        errorType: BAD_REQUEST,
      });
      return;
    }

    comment.likes.push(userId);

    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
      new: true,
    });

    res.status(200).json({
      success: true,
      comment: updatedComment,
      message: "Comment liked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const unlikeAComment = async (req: Request, res: Response) => {
  try {
    try {
      likeUnlikeACommentSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        error,
        message: "Some fields are missing or invalid",
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const isLiked = comment.likes.includes(userId);
    if (!isLiked) {
      res.status(400).json({
        success: false,
        message: "The comment has already not been liked.",
        errorType: BAD_REQUEST,
      });
      return;
    }

    comment.likes = comment.likes.filter(
      (id) => id.toString() !== userId.toString()
    );

    const updatedComment = await Comment.findByIdAndUpdate(commentId, comment, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Comment unliked successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};
