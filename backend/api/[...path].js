import app from "../src/app.js";
import database from "../src/config/database.js";

let dbPromise;

const connectDatabase = async () => {
  if (!dbPromise) {
    dbPromise = database();
  }

  await dbPromise;
};

export default async function handler(req, res) {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      msg: "Database connection failed",
    });
  }
}
