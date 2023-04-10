import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// internal imports
import authUserRoute from "./routes/authUser";
import userRoute from "./routes/user";

// modules
const app = express();

//
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connnect ot database
mongoose
  .connect(`${process.env.MONGODB_CONNECTION_STRING}`)
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err: object) => {
    console.log(err);
  });

// routes
app.get("/api", (req: express.Request, res: express.Response) => {
  return res.status(200).send({ message: "OK" });
});
app.use("/api", authUserRoute);
app.use("/api", userRoute);

// error handlers
// not found handler
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
      error: "Requested URL not found!",
    });
  }
);
// default handler
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({
      error: err.message,
    });
  }
);

// server running
app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Applicatioin running on port ${process.env.APPLICATION_PORT}`);
});
