import {body} from "express-validator"

export const validateNoticias = [
    body("title")
    .trim()
    .notEmpty().withMessage("El título es obligatorio")
    .isLength({ min: 5, max: 150 })
    .withMessage("El título debe tener entre 5 y 150 caracteres"),

  body("content")
    .notEmpty().withMessage("El contenido es obligatorio")
    .isLength({ min: 20 })
    .withMessage("El contenido debe tener al menos 20 caracteres"),

  body("author")
    .notEmpty().withMessage("El autor es obligatorio"),

  body("category")
  .toLowerCase()
    .notEmpty().withMessage("La categoría es obligatoria")
    .isIn(["masculino", "femenino", "juvenil"])
    .withMessage("Categoría inválida"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags debe ser un array"),

]


export const validateNoticiasUpdate = [
  body("title").optional().notEmpty(),
  body("content").optional().notEmpty(),
  body("author").optional().notEmpty(),
  body("category")
    .optional()
    .toLowerCase()
    .isIn(["masculino", "femenino", "juvenil"])
    .withMessage("Categoría inválida"),

  body("tags").optional().isArray(),
];