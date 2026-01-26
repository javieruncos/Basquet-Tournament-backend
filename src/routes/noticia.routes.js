import { Router } from "express";
import  {upload } from "../middlewares/multer.js";
import { crearNoticia } from "../controllers/Noticias/noticiasController.js";

const router = Router();

router.post("/noticias",upload.single("image"),crearNoticia)


export default router;