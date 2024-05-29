import { channels, users, comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./validation.js";

export const createComment = async (channelId, reviewId, userId, text) => {
  try {
    if (
      !ObjectId.isValid(channelId) ||
      !ObjectId.isValid(reviewId) ||
      !ObjectId.isValid(userId)
    ) {
      throw new Error("Invalid channel, review, or user ID");
    }

    validation.validateString(text, "comment");

    const channelCollection = await channels();
    const userCollection = await users();
    const objUserId = new ObjectId(userId);
    const user = await userCollection.findOne({ _id: objUserId });

    if (!user) {
      throw new Error(`No user found with id: ${userId}`);
    }
    const commenterName = `${user.firstName} ${user.lastName}`;

    const commentData = {
      _id: new ObjectId(),
      userId,
      commenterName,
      text,
      createdDate: new Date(),
    };

    const updateResult = await channelCollection.updateOne(
      {
        _id: new ObjectId(channelId),
        "reviews._id": new ObjectId(reviewId),
      },
      { $push: { "reviews.$.comments": commentData } }
    );

    console.log(
      "Inserting comment for channel:",
      channelId,
      " and review:",
      reviewId
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Channel or review not found or comment not added");
    }

    const userToUpdate = await userCollection.findOne({ _id: objUserId });

    if (!userToUpdate) {
      throw new Error(`Error: No user found with the id: ${userId}`);
    }

    const updateUser = await userCollection.findOneAndUpdate(
      { _id: objUserId },
      {
        $push: { comments: commentData },
      },
      { returnDocument: "after" }
    );

    return commentData;
  } catch (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }
};

export const getAllComments = async (reviewId) => {
  try {
    if (!ObjectId.isValid(reviewId)) {
      throw new Error("Invalid review ID");
    }

    const channelCollection = await channels();
    const channel = await channelCollection.findOne(
      { "reviews._id": new ObjectId(reviewId) },
      { projection: { "reviews.$": 1 } }
    );

    if (!channel || !channel.reviews || channel.reviews.length === 0) {
      throw new Error("Review not found");
    }

    return channel.reviews[0].comments || [];
  } catch (error) {
    throw new Error(`Failed to retrieve comments: ${error.message}`);
  }
};

export const getComment = async (commentId) => {
  try {
    if (!ObjectId.isValid(commentId)) {
      throw new Error("Invalid comment ID");
    }

    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne(
      { "comments._id": new ObjectId(commentId) },
      { projection: { "comments.$": 1 } } // Use projection to get the specific comment
    );

    if (!review || !review.comments) {
      throw new Error("Comment not found");
    }

    return review.comments[0];
  } catch (error) {
    throw new Error(`Failed to retrieve comment: ${error.message}`);
  }
};
