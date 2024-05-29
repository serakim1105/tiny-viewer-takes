import channelRoutes from "./channels.js";
import reviewRoutes from "./reviews.js";
import userRoutes from "./users.js";
import commentsRoutes from "./comments.js";

const configRoutes = (app) => {
  app.use("/", channelRoutes);
  app.use("/", userRoutes);
  app.use("/", reviewRoutes);
  app.use("/", commentsRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default configRoutes;
