import Post from "../models/Post";
import User from "../models/User";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  RESOURCE_NOT_FOUND,
  UNAUTHORIZED,
} from "./errorTypes";
import { createPostSchema, updatePostSocketSchema } from "./validators";

export const getPostById = async (data: any) => {
  try {
    const { postId, userId } = data;
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        post: null,
        errorType: RESOURCE_NOT_FOUND,
      };
    }
    const post = await Post.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "Post not found",
        post: null,
        errorType: RESOURCE_NOT_FOUND,
      };
    }
    if (post.authorId.toString() !== userId.toString()) {
      return {
        success: false,
        message: "User not authorized",
        post: null,
        errorType: UNAUTHORIZED,
      };
    }
    return { success: true, message: "Post found", post };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      post: null,
      errorType: INTERNAL_SERVER_ERROR,
    };
  }
};

export const createPost = async (data: any) => {
  try {
    try {
      createPostSchema.parse(data);
    } catch (error) {
      return {
        success: false,
        error,
        message: "Some fields are missing or invalid",
        post: null,
        errorType: BAD_REQUEST,
      };
    }
    const user = await User.findById(data.authorId);
    const post = await Post.create({
      ...data,
      authorInfo: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        profilePicture: user?.profilePicture,
        username: user?.username,
      },
    });
    return { success: true, message: "Post created", post };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      post: null,
      errorType: INTERNAL_SERVER_ERROR,
    };
  }
};

export const updatePost = async (data: any) => {
  try {
    try {
      updatePostSocketSchema.parse(data);
    } catch (error) {
      return {
        success: false,
        error,
        message: "Some fields are missing or invalid",
        post: null,
        errorType: BAD_REQUEST,
      };
    }
    const { authorId, postId } = data;
    const user = await User.findById(authorId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
        post: null,
        errorType: RESOURCE_NOT_FOUND,
      };
    }
    const post = await Post.findById(postId);
    if (!post) {
      return {
        success: false,
        message: "Post not found",
        post: null,
        errorType: RESOURCE_NOT_FOUND,
      };
    }
    if (post.authorId.toString() !== authorId.toString()) {
      return {
        success: false,
        message: "User not authorized",
        post: null,
        errorType: UNAUTHORIZED,
      };
    }
    post.title = data.title;
    post.description = data.description;
    post.image = data.image;

    const updatedPost = await Post.findByIdAndUpdate(postId, post, {
      new: true,
    });
    return { success: true, message: "Post updated", post: updatedPost };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error",
      post: null,
      errorType: INTERNAL_SERVER_ERROR,
    };
  }
};
