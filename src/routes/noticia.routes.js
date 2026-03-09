import { Router } from "express";
import  {upload } from "../middlewares/multer.js";
import { borrarNoticias, crearNoticia, getNoticiaById, getNoticias, updateNoticia } from "../controllers/Noticias/noticiasController.js";
import { verifyAdmin,verifyTokenAuth } from "../middlewares/verifyToken.js";
import { validateNoticias, validateNoticiasUpdate } from "../validators/noticiasValidators.js";
import { validate } from "../middlewares/validations.js";

const router = Router();

router.post("/noticias",verifyTokenAuth,verifyAdmin,upload.single("image"),validateNoticias,validate,crearNoticia)
router.get("/noticias",getNoticias)
router.get("/noticias/:id",getNoticiaById)
router.put("/noticias/:id",verifyTokenAuth,verifyAdmin,upload.single("image"),validateNoticiasUpdate,validate,updateNoticia)
router.delete("/noticias/:id",verifyTokenAuth,verifyAdmin,borrarNoticias)



export default router;