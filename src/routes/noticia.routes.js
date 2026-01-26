import { Router } from "express";
import  {upload } from "../middlewares/multer.js";
import { crearNoticia, getNoticias } from "../controllers/Noticias/noticiasController.js";

const router = Router();

router.post("/noticias",upload.single("image"),crearNoticia)
router.get("/noticias",getNoticias)


export default router;