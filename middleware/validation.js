import { check } from 'express-validator';
import * as db from '../db/db.js';

export const userValidation = [
  check('felhasznalonev').isString().isLength({ min: 1 }).withMessage('Felhasználónév megadása kötelező!'),
  check('jelszo').isString().isLength({ min: 1 }).withMessage('Jelszó megadása kötelező!'),
  check('jelszo2').isString().isLength({ min: 1 }).withMessage('Jelszó megadása kötelező!'),
  check('jelszo').custom((value, { req }) => {
    if (value !== req.body.jelszo2) {
      throw new Error('A két jelszó nem egyezik!');
    }
    return true;
  }),
  check('email').isEmail().withMessage('Érvényes email címet adjon meg!'),
  check('felhasznalonev').custom(async (value) => {
    const felhasznalo = await db.getFelhasznaloNev(value);
    if (felhasznalo.length > 0) {
      throw new Error('A felhasználónév foglalt!');
    }
    return true;
  }),
  check('email').custom(async (value) => {
    const felhasznalo = await db.getFelhasznaloEmail(value);
    if (felhasznalo.length > 0) {
      throw new Error('Az email cím foglalt!');
    }
    return true;
  }),
];
export const validateLogin = [
  check('felhasznalonev').isString().isLength({ min: 1 }).withMessage('Felhasználónév megadása kötelező!'),
  check('jelszo').isString().isLength({ min: 1 }).withMessage('Jelszó megadása kötelező!'),
];
