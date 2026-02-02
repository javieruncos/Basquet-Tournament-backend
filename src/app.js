import express from "express";
import cors from "cors";
import morgan from "morgan";
import noticiasRoute from "./routes/noticia.routes.js";
import clubesRoute from "./routes/clubes.routes.js";
import partidosRoute from "./routes/partidos.routes.js";
import tablaRoute from "./routes/tabla.routes.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";






const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}));
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser())

app.use("/api",noticiasRoute)
app.use("/api",clubesRoute)
app.use("/api",partidosRoute)
app.use("/api",tablaRoute)
app.use("/api/auth",userRoute)







export default app;