import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import * as db from '../db/db.js';
import checkAuth from '../middleware/checkaut.js';
import verifyToken from '../middleware/verifyToken.js';
import checkAdmin from '../middleware/checkadm.js';

const app = express();
app.use(express.json());
const uploadDir = path.join(process.cwd(), 'uploadDir');
const router = express.Router();
app.use('/uploads', express.static(uploadDir));
app.use(cookieParser());
app.use(checkAuth);
app.use(verifyToken);
app.use(checkAdmin);
router.get(['/', '/index'], verifyToken, async (req, res) => {
  const hirdetesek = await db.getHirdetesek();
  if (req.felhasznalo) {
    const admin = await db.checkAdmin(req.felhasznalo.Nev);
    if (admin.length > 0) {
      return res.render('index', { title: 'index', hirdetesek, felhasznalo: req.felhasznalo, admin: true });
    }
  }
  return res.render('index', { title: 'index', hirdetesek, felhasznalo: req.felhasznalo });
});
router.get(['/hirdetes'], verifyToken, checkAuth, (req, res) =>
  res.render('hirdetes', { title: 'hirdetés', felhasznalo: req.felhasznalo }),
);
router.get('/tovabb', verifyToken, async (req, res) => {
  const { id } = req.query;
  let tulaj = false;
  if (req.felhasznalo) {
    const hirdetes = await db.getHirdetes(id);
    const felhasznaloID = (await db.getFelhasznaloID(req.felhasznalo.Nev))[0].FelhasznaloID;
    if (hirdetes[0].FelhasznaloID === felhasznaloID) {
      tulaj = true;
    }
  }
  const hirdetes = await db.getHirdetes(id);
  const kepek = await db.getPic(id);
  return res.render('kepfeltolt', { title: 'Képek', hirdetes, kepek, tulaj, felhasznalo: req.felhasznalo });
});
router.get('/hirdetes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hirdetes = await db.getHirdetes(id);
    if (!hirdetes) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    return res.json(hirdetes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerverhiba' });
  }
});
router.get('/register', (req, res) => {
  res.render('regisztracio', { title: 'Regisztráció' });
});
router.get('/login', (req, res) => {
  res.render('bejelentkezes', { title: 'Bejelentkezés' });
});
router.get('/logout', (req, res) => {
  res.cookie('loginToken', '', { expires: new Date(0) });
  res.redirect('/index');
});
router.get('/adminisztralas', verifyToken, checkAuth, checkAdmin, async (req, res) => {
  const felhasznalok = await db.getFelhasznalok();
  const felhasznalokModositottCsoportID = felhasznalok.map((felhasznalo) => {
    if (felhasznalo.CsoportID === 1) {
      felhasznalo.CsoportID = true;
      return felhasznalo;
    }
    felhasznalo.CsoportID = false;
    return felhasznalo;
  });
  res.render('adminisztralas', {
    title: 'Adminisztrálás',
    felhasznalo: req.felhasznalo,
    felhasznalok: felhasznalokModositottCsoportID,
  });
});
router.get('/uzenetek', verifyToken, checkAuth, async (req, res) => {
  let felhasznalok = await db.getFelhasznalok();
  const felhasznaloID = (await db.getFelhasznaloID(req.felhasznalo.Nev))[0].FelhasznaloID;
  const felhasznalok2 = await db.uzenetekfogadasa(felhasznaloID);
  const olvasatlan = await db.getOlvasatlanUzenetek(felhasznaloID);
  const felhasznalok3 = await Promise.all(
    felhasznalok2.map(async (felhasznalo) => {
      const result = await db.getFelhasznalobyID(felhasznalo.ID);
      return result[0];
    }),
  );
  felhasznalok = felhasznalok.filter((felhasznalo) => felhasznalo.FelhasznaloNev !== req.felhasznalo.Nev);
  res.render('uzenetek', {
    title: 'Üzenetek',
    felhasznalo: req.felhasznalo,
    felhasznalok,
    felhasznalok2: felhasznalok3,
    olvasatlan,
  });
});
export default router;
