import express from "express";
import cors from "cors";
import morgan from "morgan";
import noticiasRoute from "./routes/noticia.routes.js";



const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use("/api",noticiasRoute)


export default app;