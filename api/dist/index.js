"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
// internal imports
const authUser_1 = __importDefault(require("./routes/authUser"));
const user_1 = __importDefault(require("./routes/user"));
// modules
const app = (0, express_1.default)();
//
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// connnect ot database
mongoose_1.default
    .connect(`${process.env.MONGODB_CONNECTION_STRING}`)
    .then(() => {
    console.log("MongoDB connection successful");
})
    .catch((err) => {
    console.log(err);
});
// routes
app.get("/api", (req, res) => {
    return res.status(200).send({ message: "OK" });
});
app.use("/api", authUser_1.default);
app.use("/api", user_1.default);
// error handlers
// not found handler
app.use((req, res, next) => {
    res.status(404).json({
        error: "Requested URL not found!",
    });
});
// default handler
app.use((err, req, res, next) => {
    res.status(500).json({
        error: err.message,
    });
});
// server running
app.listen(process.env.APPLICATION_PORT, () => {
    console.log(`Applicatioin running on port ${process.env.APPLICATION_PORT}`);
});
