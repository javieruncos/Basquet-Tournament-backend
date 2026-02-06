import { body } from "express-validator";
import mongoose from "mongoose";

export const validatePartido = [

  body("local")
    .notEmpty().withMessage("Club local requerido")
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage("Local ID inválido"),

  body("visitante")
    .notEmpty().withMessage("Club visitante requerido")
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage("Visitante ID inválido"),

  body()
    .custom(body => body.local !== body.visitante)
    .withMessage("Local y visitante no pueden ser el mismo club"),

  body("fecha")
    .notEmpty()
    .withMessage("Fecha requerida")
    .isISO8601()
    .withMessage("Fecha inválida"),

  body("hora")
    .notEmpty()
    .withMessage("Hora requerida")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato hora inválido HH:mm"),

  body("estado")
    .optional()
    .isIn(["Programado", "En juego", "Finalizado"])
    .withMessage("Estado inválido"),

];



export const validateResultado = [


  body("resultado.cuartos")
    .optional()
    .isArray({ min: 4, max: 4 })
    .withMessage("Debe haber 4 cuartos"),

  body("resultado.cuartos.*.local")
    .optional()
    .isInt({ min: 0 }),

  body("resultado.cuartos.*.visitante")
    .optional()
    .isInt({ min: 0 }),

];

export const validatePartidoUpdate = [

  body("local")
    .optional()
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage("Local ID inválido"),

  body("visitante")
    .optional()
    .custom(v => mongoose.Types.ObjectId.isValid(v))
    .withMessage("Visitante ID inválido"),

  // si vienen ambos → no pueden ser iguales
  body()
    .custom(body => {
      if (body.local && body.visitante && body.local === body.visitante) {
        throw new Error("Local y visitante no pueden ser el mismo club");
      }
      return true;
    }),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("Fecha inválida"),

  body("hora")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Formato hora inválido HH:mm"),

  body("estado")
    .optional()
    .isIn(["Programado", "En juego", "Finalizado"])
    .withMessage("Estado inválido"),

];