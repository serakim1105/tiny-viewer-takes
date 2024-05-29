import { Router } from "express";
import {
  reviewData,
  channelData,
  userData,
  commentData,
} from "../data/index.js";
import validation from "../data/validation.js";
import xss from "xss";

const router = Router();

router.route("/").post(async (req, res) => {
  try {
    if (!ObjectId.isValid(reviewId) || !ObjectId.isValid(userId)) {
      throw new Error("Invalid review, or user ID");
    }
    validation.validateString(text, "comment");

    let { reviewId, userId, text } = req.body;

    text = xss(text);

    const newComment = await commentData.createComment(reviewId, userId, text);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});
router.route("/:reviewId").get(async (req, res) => {
  try {
    let reviewId = req.params.reviewId;

    const getAllComments = await commentData.getAllComments(reviewId);
    res.status(201).json(getAllComments);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});
router.route("/:commentId").get(async (req, res) => {
  try {
    let commentId = req.params.commentId;

    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID");
    }

    const getComment = await commentData.getComment(commentId);
    res.status(201).json(getComment);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

export default router;
