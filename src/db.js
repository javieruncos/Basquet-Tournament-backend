import mongoose from "mongoose";

export const connectDB = async () => {
  const url = process.env.MONGO_URL;
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");

  } catch (error) {
    console.log("Error al conectar a la base de datos", error)
        process.exit(1);
  }
};
