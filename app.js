const express = require("express"); //import express pacakge
const mongoose = require("mongoose");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");

const app = express();
app.use(express.json());

const connectionString = "mongodb://127.0.0.1:27017/blog";

async function dbConnect() {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
  }
}

dbConnect();

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
