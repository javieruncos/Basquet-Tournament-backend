import { Router } from "express";
import { createAdmin, loginController, logout } from "../controllers/user/auth.controller.js";
import { validateLogin, validateUserRegister } from "../validators/userValidator.js";
import { validate } from "../middlewares/validations.js";

const router = Router(); 

router.post("/login",validateUserRegister,validate,loginController)
router.post("/create",createAdmin)
router.post("/logout",validateLogin,validate, logout);


export default router;