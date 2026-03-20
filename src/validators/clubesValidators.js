import { body } from "express-validator";


export const validateClubes = [
    body("name")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 5, max: 150 })
    .withMessage("El nombre debe tener entre 5 y 150 caracteres"),

     body("name")
    .trim()
    .notEmpty().withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 80 })
    .withMessage("Nombre inválido"),

  body("shortname")
    .optional()
    .isLength({ max: 10 })
    .withMessage("Shortname demasiado largo"),

  body("city")
    .optional()
    .isString(),

  body("description")
    .optional()
    .isString(),

  body("colors.primary")
    .optional()
    .isString(),

  body("colors.secondary")
    .optional()
    .isString(),

  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isIn(["Masculino", "Femenino", "Juvenil"])
    .withMessage("Categoría inválida"),

];

export const validateClubUpdate = [

  body("name").optional().notEmpty(),

  body("shortname").optional().isLength({ max: 10 }),

  body("city").optional(),

  body("description").optional(),

  body("colors.primary").optional(),

  body("colors.secondary").optional(),

  body("category")
    .optional()
    .isIn(["Masculino", "Femenino", "Juvenil"]),

];