import { ObjectId } from "mongodb";
import { channels } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import * as helpers from "../helpers.js";

const createReview = async (channelId, userId, title, review, rating) => {
  //Validate input.
  helpers.validate([
    { value: channelId, type: "string", name: "channelId" },
    { value: userId, type: "string", name: "userID" },
    { value: title, type: "string", name: "title" },
    { value: review, type: "string", name: "review" },
    {
      value: rating,
      type: "number",
      name: "rating",
      range: { min: 1, max: 5 },
    },
  ]);

  //Check if rating has more than one decimal place.
  if (!/^\d(\.\d)?$/.test(String(rating))) {
    throw new Error("The Rating must have at most one decimal place.");
  }

  //Check if channelId is a valid ObjectId
  if (!ObjectId.isValid(channelId) || !ObjectId.isValid(userId)) {
    throw new Error("Channel ID or User ID provided is not a valid Object ID.");
  }

  /********************** Add review to channel **********************/

  //Obtain connection to channels collection.
  const channelCollection = await channels();

  //Obtain connection to users collection.
  const userCollection = await users();

  //Convert string channelId to ObjectId.
  const objChannelId = new ObjectId(channelId);

  //Convert string userId to ObjectId.
  const objUserId = new ObjectId(userId);

  //Find the channel to which the review will be added.
  const channel = await channelCollection.findOne({ _id: objChannelId });

  if (!channel) {
    throw new Error(`Error: No channel found with the id: ${channelId}`);
  }

  const user = await userCollection.findOne({ _id: objUserId });

  if (!user) {
    throw new Error(`No user found with id: ${userId}`);
  }
  const reviewerName = `${user.firstName} ${user.lastName}`;
  console.log("User found:", reviewerName);

  const existingReview = await channelCollection.findOne({
    _id: objChannelId,
    "reviews.userId": objUserId,
  });

  if (existingReview) {
    throw "User has already reviewed this channel";
  }

  //Create new review object.
  const newReview = {
    _id: new ObjectId(),
    userId: objUserId,
    title: title.trim(),
    review: review.trim(),
    rating,
    reviewerName,
    reviewDate: new Date().toLocaleDateString("en-US"),
    comments: [],
  };

  //Update the channel with new review and update the average rating.
  const updateInfo = await channelCollection.updateOne(
    { _id: objChannelId },
    {
      $push: { reviews: newReview },
      $set: {
        averageRating: helpers.calculateNewAverage(channel.reviews, rating),
      },
    }
  );

  //If no channel was found for the id or no modification was made, then throw an error.
  if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
    throw new Error("Error: Failed to add review to the channel.");
  }

  //Find the user to which the review will be added.
  const userToUpdate = await userCollection.findOne({ _id: objUserId });

  if (!userToUpdate) {
    throw new Error(`Error: No user found with the id: ${userId}`);
  }

  //Update the user with new review
  const updateUser = await userCollection.findOneAndUpdate(
    { _id: objUserId },
    {
      $push: { reviews: newReview },
    },
    { returnDocument: "after" }
  );

  console.log(updateUser);

  return newReview;
};

const getAllReviews = async (channelId) => {
  //Validate the input.
  helpers.validate([{ value: channelId, type: "string", name: "channelId" }]);

  //Check if channelId is a valid ObjectId.
  if (!ObjectId.isValid(channelId)) {
    throw new Error("Error: channel ID provided is not a valid Object ID");
  }

  //Obtain a connection to the channels collection.
  const channelCollection = await channels();

  //Convert string channelId to OpjectId.
  const objchannelId = new ObjectId(channelId);

  //Find the channel and get only the reviews using projectioin
  const channel = await channelCollection.findOne(
    { _id: objchannelId },
    { projection: { reviews: 1, _id: 0 } }
  );

  //If no channel was found for the ID, then throw an error.
  if (!channel) {
    throw new Error(`Error: No channel found with the id: ${channelId}`);
  }

  //Return the reviews or an empty array if no reviews exist.
  return channel.reviews || [];
};

const getReview = async (reviewId) => {
  //Validate the input.
  helpers.validate([{ value: reviewId, type: "string", name: "reviewId" }]);

  //If the reviewId is not a valid ObjectId, then throw an error.
  if (!ObjectId.isValid(reviewId)) {
    throw new Error("Error: Review ID provided is not a valid Object ID.");
  }

  //Obtain a connection to the channel collection.
  const channelCollection = await channels();

  //Convert string channelId to OpjectId.
  const objReviewId = new ObjectId(reviewId);

  //Find the review with objReviewId. Use projection to only return the reviews field of the
  //document and only return the first element that matches the filter.
  const channel = await channelCollection.findOne(
    { "reviews._id": objReviewId },
    { projection: { "reviews.$": 1 } }
  );

  //If no channel is found that has a review with reviewId or the reviews array of that channel is empty.
  if (!channel || channel.reviews.length === 0) {
    throw new Error(`Error: No review found with the id: ${reviewId}`);
  }

  //Return the specific review.
  const review = channel.reviews[0];
  return {
    _id: review._id,
    title: review.title,
    reviewDate: review.reviewDate,
    review: review.review,
    rating: review.rating,
  };
};

const removeReview = async (reviewId, userId) => {
  if (!reviewId) throw new Error("Review ID must be provided");
  if (typeof reviewId !== "string" || reviewId.trim().length === 0)
    throw new Error("Review ID must be a non-empty string");
  if (typeof userId !== "string" || userId.trim().length === 0)
    throw new Error("User ID must be a non-empty string");
  if (!ObjectId.isValid(reviewId))
    throw new Error("Review ID is not a valid ObjectId");

  const channelsCollection = await channels();

  // Find the review and check if the logged-in user is the reviewer
  const channelContainingReview = await channelsCollection.findOne({
    reviews: {
      $elemMatch: { _id: new ObjectId(reviewId), userId: new ObjectId(userId) },
    },
  });

  if (!channelContainingReview) {
    throw "User is not authorized to delete this review";
  }

  const result = await channelsCollection.findOneAndUpdate(
    { "reviews._id": new ObjectId(reviewId) },
    { $pull: { reviews: { _id: new ObjectId(reviewId) } } },
    { returnDocument: "after" }
  );

  if (!result) throw new Error("Review not found");

  let averageRating = 0;
  if (result.reviews.length > 0) {
    const totalRating = result.reviews.reduce(
      (acc, cur) => acc + cur.rating,
      0
    );
    averageRating = totalRating / result.reviews.length;
  }

  await channelsCollection.updateOne(
    { _id: result._id },
    { $set: { averageRating: averageRating } }
  );

  const usersCollection = await users();

  const removeFromUser = await usersCollection.findOneAndUpdate(
    { "reviews._id": new ObjectId(reviewId) },
    { $pull: { reviews: { _id: new ObjectId(reviewId) } } },
    { returnDocument: "after" }
  );

  if (!removeFromUser) throw new Error("Review not found");

  return result;
};

export { createReview, getAllReviews, getReview, removeReview };
