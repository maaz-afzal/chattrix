import mongoose from "mongoose";

let connectionPromise;

const database = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI);
  }

  try {
    await connectionPromise;
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (err) {
    connectionPromise = null;
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
};

export default database;
