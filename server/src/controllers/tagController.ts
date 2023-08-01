import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR, RESOURCE_NOT_FOUND } from "../utils/errorTypes";
import Tag from "../models/Tag";

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    res.status(200).json({
      success: true,
      tags,
      message: "Successfully fetched all tags",
    });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
      message: "Internal server error",
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const getTagsByTopic = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const tags = await Tag.find({ topic });
    if (!tags) {
      res.status(404).json({
        success: false,
        message: `No tags found with topic: ${topic}`,
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    res.status(200).json({
      success: true,
      tags,
      message: `Successfully fetched all tags with topic: ${topic}`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
      message: "Internal server error",
      errorType: INTERNAL_SERVER_ERROR,
    });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const { topic, subTopics } = req.body;
    const tag = await Tag.create({ topic, subTopics });
    res.status(201).json({
      success: true,
      tag,
      message: "Successfully created tag",
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal server error",
      errorType: INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};

export const getTagBySubtopic = async (req: Request, res: Response) => {
  try {
    const { subtopic } = req.params;
    const tag = await Tag.findOne({ "subTopics.subTopic": subtopic });
    if (!tag) {
      res.status(404).json({
        success: false,
        message: `No tags found with subtopic: ${subtopic}`,
        errorType: RESOURCE_NOT_FOUND,
      });
      return;
    }
    res.status(200).json({
      success: true,
      tag,
      message: `Successfully fetched tag with subtopic: ${subtopic}`,
    });
  } catch (error) {
    res.status(500).json({
      error,
      message: "Internal server error",
      errorType: INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
};
