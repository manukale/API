import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { connect } from "mongoose";

import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import dataRoute from "./routes/data.js";
import uploadRoute from "./routes/upload.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 9099;

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/signatures", express.static("signatures"));
app.use('/api/sample_file_export',express.static("sample_file_export"));

app.use("/api/auth", authRoute);
app.use("/api/data",  dataRoute);
app.use('/api/excel',uploadRoute)

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status,
    stack: err.stack,
  });
});

const connectDB = () => {
  try {
    mongoose.connect(process.env.URI);
    console.log("Connecting Database...");
  } catch (error) {
    console.log("Error....");
    console.log(error);
  }
};

mongoose.connection.on("connected", () => {
  console.log("Database Connection Successfull...");
});
mongoose.connection.on("disconnected", () => {
  console.log("Database Connection Failed...");
});
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
mongoose.set("strictQuery", true);
app.listen(port, () => {
  connectDB();
  console.log(`Listening at ${port}`);
});
