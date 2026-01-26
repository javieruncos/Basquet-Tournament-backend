import { Router } from "express";
import  {upload } from "../middlewares/multer.js";
import { crearNoticia, getNoticiaById, getNoticias, updateNoticia } from "../controllers/Noticias/noticiasController.js";

const router = Router();

router.post("/noticias",upload.single("image"),crearNoticia)
router.get("/noticias",getNoticias)
router.get("/noticias/:id",getNoticiaById)
router.put("/noticias/:id",upload.single("image"),updateNoticia)



export default router;