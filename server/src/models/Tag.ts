import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      unique: true,
    },
    subTopics: [
      {
        subTopic: {
          type: String,
          required: true,
        },
        items: {
          type: [String],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model("Tag", TagSchema);

export default Tag;
