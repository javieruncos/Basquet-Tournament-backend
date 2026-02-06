import { body } from "express-validator";

export const validateUserRegister = [
  body("name")
    .notEmpty().withMessage("Nombre requerido")
    .isLength({ min: 3 }).withMessage("Mínimo 3 caracteres"),

  body("email")
    .isEmail().withMessage("Email inválido")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password mínimo 6 caracteres"),

  body("role")
    .optional()
    .isIn(["admin"])
    .withMessage("Rol inválido")
];


export const validateLogin = [
  body("email")
    .isEmail().withMessage("Email inválido"),

  body("password")
    .notEmpty().withMessage("Password requerido")
];