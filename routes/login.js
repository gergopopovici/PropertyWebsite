import express from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { validationResult } from 'express-validator';
import * as db from '../db/db.js';
import { userValidation, validateLogin } from '../middleware/validation.js';

const app = express();
app.use(express.json());
const router = express.Router();
app.use(cookieParser());
const secret = '92e001516475925247579858f731b6c65f178002bbb93c12cf3b09afeaceeca6';
router.post('/submitregistration_form', express.urlencoded({ extended: true }), userValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res
      .status(400)
      .render('regisztracio', { message: `Hiba történt a validálás során: ${errorMessages.join(', ')}` });
  }
  const hashSize = 30;
  const saltSize = 30;
  const hashAlgorithm = 'sha512';
  const iterations = 1000;
  const salt = crypto.randomBytes(saltSize);
  const hash = await crypto.pbkdf2Sync(req.body.jelszo, salt, iterations, hashSize, hashAlgorithm);
  const hashWithSalt = `${hash.toString('base64')}:${salt.toString('base64')}`;
  const beszurt = await db.insertFelhasznalo(
    req.body.nev,
    req.body.felhasznalonev,
    req.body.email,
    hashWithSalt,
    salt.toString('base64'),
  );
  if (beszurt === 1) {
    return res.redirect('/login');
  }
  return res.status(500).render('regisztracio', { message: 'Hiba történt a beszurás során' });
});
router.post('/submitlogin_form', express.urlencoded({ extended: true }), validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('bejelentkezes', { message: 'Hiba történt a validálás során' });
  }
  const felhasznalo = await db.getLogindData(req);
  if (felhasznalo.length === 0) {
    return res.status(401).render('bejelentkezes', { message: 'Nem található ilyen felhasználó' });
  }
  const jelszoHash = felhasznalo[0].Jelszo;
  const so = felhasznalo[0].Salt;
  const hash = await crypto.pbkdf2Sync(req.body.jelszo, Buffer.from(so, 'base64'), 1000, 30, 'sha512');
  const hashWithSalt = `${hash.toString('base64')}:${so}`;
  if (jelszoHash !== hashWithSalt) {
    return res.status(401).render('bejelentkezes', { message: 'Hibás jelszó' });
  }
  const token = jwt.sign({ felhasznalo: { Nev: req.body.felhasznalonev } }, secret, {
    expiresIn: '60m',
  });
  res.cookie('loginToken', token, { httpOnly: true });
  return res.redirect('/index');
});
export default router;
