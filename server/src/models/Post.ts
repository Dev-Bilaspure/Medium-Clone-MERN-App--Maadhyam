import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorInfo: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      profilePicture: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      }
    },
    image: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isCommentsEnabled: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
