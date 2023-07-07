import User from "../models/User";
import { Request, Response } from "express";
import { hashPassword } from "../utils/helperMethods";
import mongoose from "mongoose";
import {
  bookmarkUnbookmarkAPostSchema,
  followUserSchema,
  unfollowUserSchema,
  updateUserSchema,
} from "../utils/validators";
import Post from "../models/Post";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  RESOURCE_NOT_FOUND,
} from "../utils/errorTypes";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    res.status(200).json({ success: true, user, message: "User found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    try {
      updateUserSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.username) user.username = req.body.username;
    if (req.body.password)
      user.password = await hashPassword(req.body.password);
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
      user,
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, user: updatedUser, message: "User updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const followAUser = async (req: Request, res: Response) => {
  try {
    try {
      followUserSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const currentUserId = req.params.currentUserId;
    const userIdToFollow = req.body.userIdToFollow;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const userToFollow = await User.findById(userIdToFollow);
    if (!userToFollow) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (currentUserId.toString() === userIdToFollow.toString()) {
      res.status(400).json({
        success: false,
        message: "You can't follow yourself",
        errorType: BAD_REQUEST,
      });
      return;
    }

    if (currentUser.followings.includes(userIdToFollow)) {
      res.status(400).json({
        success: false,
        message: "You already follow this user",
        errorType: BAD_REQUEST,
      });
      return;
    }

    currentUser.followings.push(userIdToFollow);
    userToFollow.followers.push(new mongoose.Types.ObjectId(currentUserId));

    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUserId },
      currentUser,
      { new: true }
    );
    await User.findOneAndUpdate({ _id: userIdToFollow }, userToFollow, {
      new: true,
    });

    res
      .status(200)
      .json({ success: true, user: updatedUser, message: "User updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const unFollowAUser = async (req: Request, res: Response) => {
  try {
    try {
      unfollowUserSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const currentUserId = req.params.currentUserId;
    const userIdToUnfollow = req.body.userIdToUnfollow;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const userToUnfollow = await User.findById(userIdToUnfollow);
    if (!userToUnfollow) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (currentUserId === userIdToUnfollow.toString()) {
      res.status(400).json({
        success: false,
        message: "You can't unfollow yourself",
        errorType: BAD_REQUEST,
      });
      return;
    }

    if (!currentUser.followings.includes(userIdToUnfollow)) {
      res.status(400).json({
        success: false,
        message: "You already don't follow this user",
        errorType: BAD_REQUEST,
      });
      return;
    }

    currentUser.followings = currentUser.followings.filter(
      (followingId) => followingId.toString() !== userIdToUnfollow.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => followerId.toString() !== currentUserId.toString()
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: currentUserId },
      currentUser,
      { new: true }
    );
    await User.findOneAndUpdate({ _id: userIdToUnfollow }, userToUnfollow, {
      new: true,
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "User updated successfully",
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

export const getUsersFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    const followers = await User.find({ _id: { $in: user.followers } });
    if (followers.length === 0) {
      res
        .status(200)
        .json({ success: true, message: "No followers found", followers });
      return;
    }

    res.status(200).json({
      success: true,
      users: followers,
      message: "Followers found successfully.",
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

export const getUsersFollowings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        RESOURCE_NOT_FOUND,
      });
      return;
    }
    const followings = await User.find({ _id: { $in: user.followings } });
    if (followings.length === 0) {
      res.status(200).json({
        success: true,
        followings,
        message: "No followings found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      users: followings,
      message: "Followings found successfully.",
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

export const bookmarkAPost = async (req: Request, res: Response) => {
  try {
    try {
      bookmarkUnbookmarkAPostSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (user.bookmarks.includes(postId)) {
      res.status(400).json({
        success: false,
        message: "You already bookmarked this post",
        errorType: BAD_REQUEST,
      });
      return;
    }

    user.bookmarks.push(postId);

    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post bookmarked successfully",
      user: updatedUser?.toObject(),
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

export const unbookmarkAPost = async (req: Request, res: Response) => {
  try {
    try {
      bookmarkUnbookmarkAPostSchema.parse(req.body);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Some fields are missing or invalid",
        error,
        errorType: BAD_REQUEST,
      });
      return;
    }

    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    const { postId } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({
        success: false,
        message: "Post not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }

    if (!user.bookmarks.includes(postId)) {
      res.status(400).json({
        success: false,
        message: "You already unbookmarked this post",
        errorType: BAD_REQUEST,
      });
      return;
    }

    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== postId.toString()
    );

    const updatedUser = await User.findByIdAndUpdate(userId, user, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Post unbookmarked successfully",
      user: updatedUser?.toObject(),
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

export const getUsersBookmarkedPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    const posts = await Post.find({ _id: { $in: user.bookmarks }, isPublished: true }).sort({
      createdAt: -1,
    });
    if (posts.length === 0) {
      res
        .status(200)
        .json({ success: true, posts, message: "No bookmarked post found" });
      return;
    }
    res.status(200).json({
      success: true,
      posts,
      message: "Bookmarked posts found successfully",
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

export const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ followers: -1 });

    res.status(200).json({
      success: true,
      users,
      message: "Suggested users found successfully.",
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


export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const {username} = req.params;
    const user = await User.findOne({username});
    if(!user){
      res.status(404).json({
        success: false,
        message: "User not found",
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    res.status(200).json({
      success: true,
      user,
      message: "User found successfully.",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
}