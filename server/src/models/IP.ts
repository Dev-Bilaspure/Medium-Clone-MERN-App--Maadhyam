import mongoose from "mongoose";

const IPSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["POST", "USER_PROFILE"],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const IP = mongoose.model("IP", IPSchema);

export default IP;
