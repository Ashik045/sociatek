const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// internal imports
const authController = require("./routes/authUser");

// modules
const app = express();

//
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connnect ot database
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch((err: object) => {
    console.log(err);
  });

// routes
app.get("/api", (req: Request, res: Response) => {
  // @ts-ignore
  return res.status(200).send({ message: "OK" });
});
app.use("/api/user", authController);

// error handlers
// not found handler
// @ts-ignore
app.use((req, res, next) => {
  res.status(404).json({
    error: "Requested URL not found!",
  });
});
// default handler
// @ts-ignore

app.use((err: Error, req: Request, res: Response, next) => {
  // @ts-ignore
  res.status(500).json({
    error: err,
  });
});

// server running
app.listen(process.env.APPLICATION_PORT, () => {
  console.log(`Applicatioin running on port ${process.env.APPLICATION_PORT}`);
});
