import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createChannel } from "../data/channels.js";
import { createReview } from "../data/reviews.js";
import { getReview } from "../data/reviews.js";
import { userData } from "../data/index.js";
import { createComment, getAllComments, getComment } from "../data/comment.js";
const main = async () => {
  const db = await dbConnection();
  await db.dropDatabase();
  // Creating users
  const user1 = await userData.registerUser(
    "Sera",
    "Kim",
    "sera.kim@example.com",
    "Password123!",
    "Password123!"
  );
  const user2 = await userData.registerUser(
    "Khalid",
    "Isahak",
    "khalid.isahak@example.com",
    "Password123!",
    "Password123!"
  );
  const user3 = await userData.registerUser(
    "Priscilla",
    "Lin",
    "priscilla.lin@example.com",
    "Password123!",
    "Password123!"
  );
  const user4 = await userData.registerUser(
    "John",
    "Wright",
    "john.wright@example.com",
    "Password123!",
    "Password123!"
  );
  // Creating channels
  const channel5 = await createChannel(
    "Smithsonian Channel ",
    "Smithsonian Channel",
    "Channel dedicated to making learning science through interactive videos and games.",
    "http://www.youtube.com/@SmithsonianChannel",
    ["educational", "interactive"],
    ["children", "science"],
    3
  );
  const channel6 = await createChannel(
    "Bluey",
    "Bluey Official TV",
    "Enjoy a variety of children's programming including cartoons, educational shows, and sing-alongs. Your dog will love it too!",
    "http://www.youtube.com/@BlueyOfficialChannel",
    ["cartoons", "animals", "music"],
    ["children", "entertainment"],
    3
  );
  const channel7 = await createChannel(
    "Disney Junior",
    "Disney",
    "Stories and fairy tales brought to life through animations and puppetry.",
    "http://www.youtube.com/@disneyjunior",
    ["stories", "fairy tales"],
    ["children", "storytelling"],
    4
  );
  const channel8 = await createChannel(
    "MoonBug Kids",
    "MoonBug Kids",
    "Explore the world around us with fun facts and adventures tailored for young minds.",
    "http://www.youtube.com/@MoonbugKids_FunwithFriends",
    ["exploration", "education"],
    ["children", "exploration"],
    5
  );
  const channel9 = await createChannel(
    "Bill Nye The Science Guy",
    "Science Kids Inc",
    "Simple experiments and science explanations that spark curiosity in young viewers.",
    "http://www.youtube.com/@TheRealBillNye",
    ["science", "experiments"],
    ["children", "learning"],
    6
  );
  const channel10 = await createChannel(
    "Art and Crafts",
    "Art and Crafts Inc",
    "Step-by-step craft tutorials and art projects designed for kids.",
    "http://www.youtube.com/@5MinuteCraftsPLAY",
    ["crafts", "creative"],
    ["children", "arts"],
    3
  );
  const channel11 = await createChannel(
    "SuperHeroes Girls",
    "Hero Adventures Inc",
    "Superheroes and exciting adventures captivate and educate through moral stories.",
    "http://www.youtube.com/@DCSuperHeroGirls",
    ["superheroes", "adventures"],
    ["children", "morals"],
    4
  );
  const channel12 = await createChannel(
    "Cotton Candy Corner",
    "Puzzle Play Inc",
    "Interactive puzzle-solving videos that encourage critical thinking and problem-solving.",
    "http://www.youtube.com/@Cottoncandycorner",
    ["puzzles", "games"],
    ["children", "games"],
    4
  );
  const channel13 = await createChannel(
    "Nat Geo Kids",
    "Animal Wonders Inc",
    "Educational channel about animals and nature made engaging for young viewers.",
    "http://www.youtube.com/@natgeokids",
    ["animals", "nature"],
    ["children", "education"],
    5
  );
  const channel14 = await createChannel(
    "Magic Math",
    "Magic Math Inc",
    "Making math magical with fun, animated lessons and interactive quizzes.",
    "http://www.youtube.com/@TheMagicOfMath",
    ["math", "education"],
    ["children", "math"],
    6
  );
  const channel15 = await createChannel(
    "History Home School",
    "History Heroes Inc",
    "Learn about historical figures and times through animated stories and games.",
    "http://www.youtube.com/@HomeschoolPop",
    ["history", "stories"],
    ["children", "learning"],
    7
  );
  const channel16 = await createChannel(
    "Dino Lingo",
    "Little Linguists Inc",
    "Language learning made easy and fun for kids with songs, games, and stories.",
    "http://www.youtube.com/@Dinolingo1",
    ["languages", "learning"],
    ["children", "language"],
    3
  );
  const channel17 = await createChannel(
    "Nature Kids",
    "Nature Kids Inc",
    "Discover the wonders of the outdoors through camping trips and nature crafts.",
    "http://www.youtube.com/@TheRangerZakShow",
    ["nature", "outdoor"],
    ["children", "exploration"],
    5
  );
  const channel18 = await createChannel(
    "Peekaboo Kids",
    "Space Scouts Inc",
    "Journey through space with fun facts and animated adventures beyond Earth.",
    "http://www.youtube.com/@Peekaboo_Kidz",
    ["space", "science"],
    ["children", "space"],
    6
  );
  const channel19 = await createChannel(
    "NetflixJr",
    "Mystery School Inc",
    "Solve mysteries and learn about the world in this intriguing educational channel.",
    "http://www.youtube.com/@NetflixJr",
    ["mysteries", "education"],
    ["children", "learning"],
    6
  );
  async function createFortyReviews() {
    try {
      const reviews = [
        {
          channel: channel5,
          user: user1,
          title: "Engaging and Fun",
          text: "Absolutely love the interactive content!",
          rating: 5,
        },
        {
          channel: channel5,
          user: user2,
          title: "Somewhat repetitive",
          text: "It's good but tends to repeat content.",
          rating: 3,
        },
        {
          channel: channel6,
          user: user3,
          title: "Excellent for Toddlers",
          text: "My kids can't get enough of these cartoons!",
          rating: 5,
        },
        {
          channel: channel6,
          user: user4,
          title: "Just okay",
          text: "The content is fine but nothing special.",
          rating: 2,
        },
        {
          channel: channel7,
          user: user1,
          title: "Wonderfully Magical",
          text: "The fairy tales are captivating and beautifully animated.",
          rating: 5,
        },
        {
          channel: channel7,
          user: user2,
          title: "Too slow",
          text: "Nice visuals but the pacing is too slow.",
          rating: 2,
        },
        {
          channel: channel8,
          user: user3,
          title: "Incredibly Educational",
          text: "Great for learning about the world!",
          rating: 5,
        },
        {
          channel: channel8,
          user: user4,
          title: "Lacks depth",
          text: "Needs more detailed content to be truly educational.",
          rating: 3,
        },
        {
          channel: channel9,
          user: user1,
          title: "Science is fun",
          text: "Makes science exciting and accessible for all ages.",
          rating: 5,
        },
        {
          channel: channel9,
          user: user2,
          title: "More variety needed",
          text: "The experiments are cool but get repetitive.",
          rating: 3,
        },
        {
          channel: channel10,
          user: user3,
          title: "Creative Heaven",
          text: "Perfect channel for creative kids!",
          rating: 5,
        },
        {
          channel: channel10,
          user: user4,
          title: "Not clear enough",
          text: "Could use better instructions.",
          rating: 3,
        },
        {
          channel: channel11,
          user: user1,
          title: "Disappointing content",
          text: "Not as engaging as expected, very one-dimensional.",
          rating: 1,
        },
        {
          channel: channel11,
          user: user2,
          title: "Lacks creativity",
          text: "Could be improved with more original storytelling.",
          rating: 2,
        },
        {
          channel: channel12,
          user: user3,
          title: "Puzzle Master",
          text: "Great for developing critical thinking!",
          rating: 4,
        },
        {
          channel: channel12,
          user: user4,
          title: "Repetitive puzzles",
          text: "Needs more variety in puzzles to stay challenging.",
          rating: 2,
        },
        {
          channel: channel13,
          user: user1,
          title: "Engaging animal content",
          text: "My kids learned so much about animals!",
          rating: 5,
        },
        {
          channel: channel13,
          user: user2,
          title: "Too simplistic",
          text: "Good for toddlers but too simple for older kids.",
          rating: 2,
        },
        {
          channel: channel14,
          user: user3,
          title: "Math made easy",
          text: "Fantastic for learning basic math concepts!",
          rating: 5,
        },
        {
          channel: channel14,
          user: user4,
          title: "Needs more advanced topics",
          text: "Great for beginners but not challenging enough for others.",
          rating: 3,
        },
      ];
      for (const review of reviews) {
        await createReview(
          review.channel._id.toString(),
          review.user._id.toString(),
          review.title,
          review.text,
          review.rating
        );
        console.log(
          `Review added: ${review.title} with rating ${review.rating}`
        );
      }
      console.log("All reviews added successfully.");
    } catch (error) {
      console.error("Error creating reviews:", error);
    }
  }
  await createFortyReviews().catch(console.error);
  try {
    let review1;
    const pawPatrolChannel = await createChannel(
      "Paw Patrol2",
      "Paw Patrol Official",
      "Official channel for Paw Patrol. We have all the episodes available. ",
      "http://youtube.com/pawpatrol2",
      ["animal", "toy"],
      ["animation for kids", "cute"],
      2
    );
    console.log("Channel 1 added successfully");
    review1 = await createReview(
      pawPatrolChannel._id.toString(),
      user1._id.toString(),
      "Great Show",
      "My kids love watching this show every afternoon!",
      5
    );
    console.log("Review 1 added successfully to Paw Patrol channel");
    // Add a comment to the review
    const comment1 = await createComment(
      pawPatrolChannel._id.toString(),
      review1._id.toString(),
      user1._id.toString(),
      "Absolutely love it!"
    );
    console.log("Comment 1 added successfully to Review 1");
  } catch (error) {
    console.error("Error creating channel or review: ", error);
  }
};
await main().catch(console.error);
console.log("Database seeded successfully.");
