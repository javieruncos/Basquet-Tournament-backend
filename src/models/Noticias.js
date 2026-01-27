import mongoose from "mongoose";




const NoticiasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default:[], index: true},
  image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
   slug: { type: String, unique: true, sparse: true },
},{
  timestamps: true,
});







export default mongoose.model("Noticias", NoticiasSchema);