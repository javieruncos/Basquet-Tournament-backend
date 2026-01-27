import dotenv from "dotenv";
dotenv.config();
console.log("CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY);

import app from "./app.js";
import { connectDB } from "./db.js";


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();