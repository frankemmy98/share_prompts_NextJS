import mongoose from "mongoose";

let isConnected = false; // tracking the connection

export const connectToDB = async () => {
  // it sets mongoose options
  // if it isnt done there'll be a warning in the console
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompts",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
