import { Router } from "express";
import { actualizarClubes, borrarClubes, crearClubes, obtenerClubes, obtenerClubesPorId, obtenerJugadoresPorClub } from "../controllers/clubes/clubesControllers.js";
import { upload } from "../middlewares/multer.js";
import { verifyAdmin, verifyTokenAuth } from "../middlewares/verifyToken.js";
import { validateClubes, validateClubUpdate } from "../validators/clubesValidators.js";
import { validate } from "../middlewares/validations.js";


const router = Router();

// router.post('/clubes',verifyTokenAuth,verifyAdmin,upload.single('logo'),validateClubes,validate,crearClubes)
router.post('/clubes',upload.single('logo'),validateClubes,validate,crearClubes)
router.get('/clubes',obtenerClubes)
router.get('/clubes/:id',obtenerClubesPorId)
router.get('/clubes/:clubId/jugadores',obtenerJugadoresPorClub)
// router.put('/clubes/:id',verifyTokenAuth,verifyAdmin,upload.single('logo'),validateClubUpdate,validate,actualizarClubes)
router.put('/clubes/:id',upload.single('logo'),validateClubUpdate,validate,actualizarClubes)
router.delete('/clubes/:id',verifyTokenAuth,verifyAdmin,borrarClubes)


export default router;