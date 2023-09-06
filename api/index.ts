import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// internal imports
import authUserRoute from "./routes/authUser";
import postRoute from "./routes/post";
import userRoute from "./routes/user";

// modules
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Edge Functions

// connnect ot database
mongoose
  .connect(`${process.env.MONGODB_CONNECTION_STRING_MAIN}`)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err: object) => {
    console.log(err);
  });

// routes
app.get("/", (req: express.Request, res: express.Response) => {
  return res.status(200).json({ message: "OK" });
});
// login and register
app.use("/api", authUserRoute);
// user update, follow, unfollow
app.use("/api", userRoute);
// post route
app.use("/api", postRoute);

// error handlers
// not found error handler
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
      error: "Requested URL not found!",
    });
  }
);
// default error handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({
      error: "Internal Server Error!",
    });
  }
);

// server running
/* listening for incoming requests on the specified port. */
app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Application running on port ${process.env.APPLICATION_PORT}`);
});
