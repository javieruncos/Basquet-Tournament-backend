import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name :{type: String, required: true},
    email: {type: String, required: true, unique: true,lowercase: true,trim: true},
    password: {type: String, required: true},
    role: {type: String, default: "admin",enum: ["admin"]},
})


export default mongoose.model("User", userSchema);