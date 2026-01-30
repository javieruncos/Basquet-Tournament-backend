import express from "express";
import cors from "cors";
import morgan from "morgan";
import noticiasRoute from "./routes/noticia.routes.js";
import clubesRoute from "./routes/clubes.routes.js";
import partidosRoute from "./routes/partidos.routes.js";





const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use("/api",noticiasRoute)
app.use("/api",clubesRoute)
app.use("/api",partidosRoute)




export default app;