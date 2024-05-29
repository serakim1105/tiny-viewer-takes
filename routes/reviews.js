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

router
  // Get all reviews  for a specific channel
  .route("/channels/:channelId/reviews")
  .get(async (req, res) => {
    try {
      let channelId = xss(req.params.channelId);
      channelId = validation.validateId(channelId, "Channel ID URL Param");
      const reviews = await reviewData.getAllReviews(channelId);
      res.json(reviews);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  })
  .post(async (req, res) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).render("login");
      }

      const userId = req.session.user._id;
      if (!userId) {
        return res.status(400).send("User ID is undefined");
      }

      let { channelId } = req.params;
      if (!channelId) {
        return res.status(400).send("Channel ID is undefined");
      }

      let { reviewTitle, reviewDescription, reviewRating, reviewerName } =
        req.body;

      reviewTitle = xss(reviewTitle);
      reviewDescription = xss(reviewDescription);
      reviewRating = parseFloat(xss(reviewRating));

      const newReview = await reviewData.createReview(
        channelId,
        userId,
        reviewTitle,
        reviewDescription,
        reviewRating
      );

      const channel = await channelData.getChannel(channelId);
      if (!newReview) {
        throw new Error("Failed to create review");
      }

      res.redirect(`/channels/${channelId}`);
    } catch (error) {
      res.render("error", {
        errorMessage: error,
        title: "Error",
      });
    }
  });

router
  // Get a review by its id.
  .route("/review/:reviewId")
  .get(async (req, res) => {
    try {
      let reviewId = xss(req.params.reviewId);
      reviewId = validation.validateId(reviewId, "Review ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e.toString() });
    }

    try {
      const review = await reviewData.getReview(reviewId);
      return res.json(review);
    } catch (e) {
      return res.status(404).json({ error: e.toString() });
    }
  })
  //remove a review by its Id
  .delete(async (req, res) => {
    if (!req.session || !req.session.user) {
      return res.status(401).render("login");
    }
    try {
      const userId = req.session.user._id;
      let revId = xss(req.params.reviewId);

      const updatedChannel = await reviewData.removeReview(revId, userId);
      return res.json(updatedChannel);
    } catch (error) {
      console.error("Error removing review:", error);
      res.status(400).send(error);
    }
  });

// get  a comment
router.route("/comment").post(async (req, res) => {
  try {
    let { reviewId, userId, text } = req.body;

    reviewId = xss(reviewId);
    userId = xss(userId);
    text = xss(text);

    const newComment = await commentData.createComment(reviewId, userId, text);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

// Route for adding a comment to a review
router.post(
  "/channels/:channelId/reviews/:reviewId/comments",
  async (req, res) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    try {
      let channelId = xss(req.params.channelId);
      let reviewId = xss(req.params.reviewId);
      const userId = req.session.user._id;
      let commentText = xss(req.body.comment);

      // Fetch user details to get the commenter's name
      const user = await userData.getUserById(userId);
      const commenterName = `${user.firstName} ${user.lastName}`;

      // Create the comment
      await commentData.createComment(channelId, reviewId, userId, commentText);
      res.redirect(`/channels/${channelId}`);
    } catch (error) {
      res.status(500).send("Failed to add comment: " + error.message);
    }
  }
);
export default router;
