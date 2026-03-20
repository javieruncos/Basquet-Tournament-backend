import { Router } from "express";
import { createAdmin, getMe, loginController, logout } from "../controllers/user/auth.controller.js";
import { validateLogin, validateUserRegister } from "../validators/userValidator.js";
import { validate } from "../middlewares/validations.js";
import { verifyTokenAuth } from "../middlewares/verifyToken.js";

const router = Router(); 

router.post("/login",validate,loginController)
router.get("/me", verifyTokenAuth, getMe);
router.post("/create",createAdmin)
router.post("/logout",verifyTokenAuth, logout);


export default router;