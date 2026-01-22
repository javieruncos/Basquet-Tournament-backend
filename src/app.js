import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";


const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

export default app;