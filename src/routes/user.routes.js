import { Router } from "express";
import { createAdmin, loginController, logout } from "../controllers/user/auth.controller.js";

const router = Router(); 

router.post("/login",loginController)
router.post("/create",createAdmin)
router.post("/logout", logout);


export default router;