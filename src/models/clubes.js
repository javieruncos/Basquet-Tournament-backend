import mongoose from "mongoose";

const ClubesSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortName: {
      type: String, // CAEE, RIVER, BOCA, etc
      uppercase: true,
      maxlength: 10,
    },

    city: {
      type: String,
      required: true,
    },

    colors: {
      primary: String,
      secondary: String,
    },

    logo: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ["Masculino", "Femenino", "Mixto"],
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Clubes", ClubesSchema)