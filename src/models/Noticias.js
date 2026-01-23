import mongoose from "mongoose";




const NoticiasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], required: true },
  image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
   slug: { type: String, unique: true, sparse: true },
});



NoticiasSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});



export default mongoose.model("Noticias", NoticiasSchema);