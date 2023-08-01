import { Router } from "express";
import { createTag, getAllTags, getTagBySubtopic, getTagsByTopic } from "../controllers/tagController";

const router = Router();

router.get("/", getAllTags);
router.get("/topic/:topic", getTagsByTopic);
router.post("/", createTag);
router.get("/subtopic/:subtopic", getTagBySubtopic);

export default router;