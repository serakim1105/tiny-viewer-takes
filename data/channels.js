import { channels } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./validation.js";

const getChannelCollection = async () => {
  return await channels();
};
const searchChannels = async (query) => {
  try {
    if (!query || query.trim() === "") {
      console.log("I can reach here");
    }
    validation.validateString(query, "search term");
    const channelCollection = await getChannelCollection();
    return await channelCollection
      .find({
        $or: [
          { channelTitle: { $regex: new RegExp(query, "i") } }, // Case-insensitive regex search on channelTitle
          { channelDescription: { $regex: new RegExp(query, "i") } }, // Case-insensitive regex search on channelDescription
        ],
      })
      .toArray();
  } catch (error) {
    res.status(500).render("error", { errorMessage: error.toString() });
  }
};

const searchKeywords = async (word) => {
  try {
    if (!word || word.trim() === "") {
      console.log("Search input cannot be empty");
      return [];
    }
    validation.validateString(word, "search keywords");
    const channelCollection = await getChannelCollection();
    return await channelCollection
      .find({ keywords: { $in: [new RegExp(word, "i")] } })
      .toArray();
  } catch (error) {
    rconsole.error("Error in searchKeywords:", error);
    throw new Error("Database operation failed");
  }
};

const createChannel = async (
  channelTitle,
  channelOwnerName,
  channelDescription,
  website,
  keywords,
  categories,
  startingAge
) => {
  if (
    !channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !website ||
    !keywords ||
    !categories ||
    !startingAge
  )
    throw "All fields need to be supplied";

  // validations
  validation.validateString(channelTitle, "channel-title");
  validation.validateString(channelOwnerName, "channel-description");
  validation.validateString(channelDescription, "channel-description");
  validation.validateUrl(website);
  validation.validateStringArray(keywords, "keywords");
  validation.validateStringArray(categories, "categories");
  validation.validateNumber(startingAge, "Parental Guidance Age");

  // Obtain connection to channel collection.
  const channelCollection = await getChannelCollection();

  // Check if a channel with the same title or website already exists
  const existingChannel = await channelCollection.findOne({
    $or: [{ channelTitle: channelTitle }, { website: website }],
  });

  if (existingChannel) {
    if (existingChannel.channelTitle === channelTitle) {
      throw "A channel with the same title already exists.";
    }
    if (existingChannel.website === website) {
      throw "A channel with the same website already exists.";
    }
  }

  // Declare new channel
  const newChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    website,
    keywords,
    categories,
    startingAge,
    reviews: [],
    averageRating: 0,
  };

  try {
    const insertResult = await channelCollection.insertOne(newChannel);
    return {
      ...newChannel,
      _id: insertResult.insertedId,
    };
  } catch (e) {
    throw `Error inserting channel: ${e.message}`;
  }
};

const getAllChannel = async () => {
  const channelCollection = await getChannelCollection();
  const channelList = await channelCollection
    .find(
      {},
      {
        projection: {
          _id: 1,
          channelTitle: 1,
          averageRating: 1,
          startingAge: 1,
          keywords: 1,
          categories: 1,
        },
      }
    )
    .toArray();
  console.log(channelList);
  return channelList;
};

//getChannel by ID
const getChannel = async (channelId) => {
  //validation: channelId
  // channelId = validation.validateId(channelId);

  //get product
  const channelCollection = await getChannelCollection();
  const channel = await channelCollection.findOne({
    _id: new ObjectId(channelId),
  });
  if (!channel) throw "No product with that id";

  return channel;
};

export {
  createChannel,
  getAllChannel,
  getChannel,
  searchChannels,
  searchKeywords,
};
