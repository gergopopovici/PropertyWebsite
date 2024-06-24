import express from 'express';
import multer from 'multer';
import path from 'path';
import { check, validationResult } from 'express-validator';
import fs, { existsSync, mkdirSync } from 'fs';
import * as db from '../db/db.js';
import verifyToken from '../middleware/verifyToken.js';
import checkOwner from '../middleware/checkOwner.js';
import checkOwnerPic from '../middleware/checkOwnerPic.js';
import checkAdmin from '../middleware/checkadm.js';
import checkAuth from '../middleware/checkaut.js';

const app = express();
app.use(express.json());
app.use(verifyToken);
app.use(checkOwner);
app.use(checkOwnerPic);
app.use(checkAdmin);
app.use(checkAuth);
const uploadDir = path.join(process.cwd(), 'uploadDir');
const router = express.Router();
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));
const upload = multer({ dest: uploadDir, limits: { fileSize: 5000000 } });
router.post(
  '/submitannouncement_form',
  verifyToken,
  checkAuth,
  express.urlencoded({ extended: true }),
  [
    check('varos').isString().isLength({ min: 4 }).withMessage('Város megadása kötelező!'),
    check('kerulet').isString().isLength({ min: 1 }).withMessage('Kerület megadása kötelező!'),
    check('felszinterulet').isInt({ min: 10 }).withMessage('A felszínterület minimum 10m^2 kell legyen.'),
    check('ar').isInt({ min: 1 }).withMessage('Az ár értéke pozitív szám kell legyen.'),
    check('szobak').isInt({ min: 1 }).withMessage('A szobák száma legalább egy kell legyen.'),
    check('datum').isDate().withMessage('A dátum érvényes dátum formátumban kell legyen.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).render('hirdetes', {
        felhasznalo: req.felhasznalo,
        message: `Hiba történt a validálás során${errors.array()}`,
      });
    }
    const felhasznaloNev = req.body.username;
    const felhasznaloID = (await db.getFelhasznaloID(felhasznaloNev))[0].FelhasznaloID;
    if (felhasznaloID.length === 0) {
      return res.status(404).render('hirdetes', { felhasznalo: req.felhasznalo, message: 'Nem található felhasználó' });
    }
    const beszurt = await db.insertHirdetes(
      felhasznaloID,
      req.body.varos,
      req.body.kerulet,
      req.body.felszinterulet,
      req.body.ar,
      req.body.szobak,
      req.body.datum,
    );
    if (beszurt === 1) {
      return res.redirect('/index');
    }
    return res
      .status(500)
      .render('hirdetes', { felhasznalo: req.felhasznalo, message: 'Hiba történt a beszurás során' });
  },
);
router.post('/submit_form', verifyToken, express.urlencoded({ extended: true }), async (req, res) => {
  const hirdetesek = await db.getKeresettHirdetesek(req);
  res.render('index', { title: 'index', hirdetesek, felhasznalo: req.felhasznalo, vissza: true });
});
router.post(
  '/submitpic_form',
  verifyToken,
  checkAuth,
  checkOwner,
  upload.single('kep'),
  checkOwner,
  async (req, res) => {
    const beszurt = await db.insertPic(req);
    if (beszurt === 1) {
      return res.redirect(`/tovabb?id=${req.body.adId}`);
    }
    return res.status(500).render('kepfeltolt', {
      title: 'Képek',
      message: 'Hiba történt a kép feltöltése során',
      felhasznalo: req.felhasznalo,
    });
  },
);
router.delete('/kep/:id', verifyToken, checkAuth, checkOwnerPic, async (req, res) => {
  try {
    const { id } = req.params;
    const kep = await db.getPicById(id);
    if (!kep || kep.length === 0) {
      return res.status(404).json({ message: 'Kép nem található' });
    }
    const torolt = await db.deletePic(id);
    if (torolt) {
      fs.unlinkSync(path.join(uploadDir, kep[0].Fajlnev));
      return res.status(200).end();
    }
    return res.status(500).json({ message: 'A kép törlése nem sikerült' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerverhiba' });
  }
});
router.post('/updateAdmin', verifyToken, checkAuth, checkAdmin, express.json(), async (req, res) => {
  const { felhasznaloID } = req.body;
  const { csoportID } = req.body;
  if (csoportID === 2) {
    const downgradeAdmin = await db.downgradeAdmin(felhasznaloID);
    if (downgradeAdmin === true) {
      return res.status(200).end();
    }
    return res.status(500).render('adminisztralas', {
      title: 'Adminisztralas',
      felhasznalo: req.felhasznalo,
      message: 'Hiba történt a downgrade során',
    });
  }
  const upgradeAdmin = await db.upgradeAdmin(felhasznaloID);
  if (upgradeAdmin === true) {
    return res.status(200).end();
  }
  return res.status(500).render('adminisztralas', {
    title: 'Adminisztralas',
    felhasznalo: req.felhasznalo,
    message: 'Hiba történt az upgrade során',
  });
});
router.delete('/hirdetesek/:id', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const kepek = await db.getPic(id);
    if (kepek.length > 0) {
      kepek.forEach((kep) => {
        const toroltKep = db.deletePic(kep.FenykepID);
        if (!toroltKep) {
          return res.status(500).json({ message: 'A kép törlése nem sikerült' });
        }
        fs.unlinkSync(path.join(uploadDir, kep.Fajlnev));
        return 2;
      });
    }
    const torolt = await db.deleteHirdetes(id);
    if (torolt) {
      return res.status(200).end();
    }
    return res.status(500).json({ message: 'A hirdetés törlése nem sikerült' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerverhiba' });
  }
});
router.post(
  '/submit_message/',
  verifyToken,
  checkAuth,
  express.urlencoded({ extended: true }),
  [
    check('uzenet').isString().isLength({ min: 1 }).withMessage('Az üzenet nem lehet üres'),
    check('felhasznaloValaszto').isInt().withMessage('A címzett nem található'),
  ],
  async (req, res) => {
    let felhasznalok = await db.getFelhasznalok();
    felhasznalok = felhasznalok.filter((felhasznalo) => felhasznalo.FelhasznaloNev !== req.felhasznalo.Nev);
    const felhasznaloID = (await db.getFelhasznaloID(req.felhasznalo.Nev))[0].FelhasznaloID;
    const felhasznalok2 = await db.uzenetekfogadasa(felhasznaloID);
    const felhasznalok3 = await Promise.all(
      felhasznalok2.map(async (felhasznalo) => {
        const result = await db.getFelhasznalobyID(felhasznalo.ID);
        return result[0];
      }),
    );
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('uzenetek', {
        felhasznalo: req.felhasznalo,
        felhasznalok,
        message: 'Hiba a validalas soran!',
        felhasznalok2: felhasznalok3,
      });
    }
    const feladoNev = req.body.felhasznaloNev;
    const feladoID = (await db.getFelhasznaloID(feladoNev))[0].FelhasznaloID;
    if (feladoID.length === 0) {
      return res.status(404).render('uzenetek', {
        felhasznalo: req.felhasznalo,
        felhasznalok,
        message: 'Nem található felhasználó',
        felhasznalok2: felhasznalok3,
      });
    }
    const { felhasznaloValaszto } = req.body;
    let { uzenet } = req.body;
    uzenet = `${req.felhasznalo.Nev}: ${uzenet}`;
    const beszurt = await db.uzenetBeszuras(feladoID, felhasznaloValaszto, uzenet);
    if (beszurt === 1) {
      return res.redirect('/uzenetek');
    }
    return res.status(500).render('uzenetek', {
      felhasznalo: req.felhasznalo,
      felhasznalok,
      message: 'Az üzenet nem lett küldve!',
      felhasznalok2: felhasznalok3,
    });
  },
);
router.post(
  '/view_messages/',
  express.urlencoded({ extended: true }),
  verifyToken,
  checkAuth,
  [check('felhasznaloValaszto2').isInt().withMessage('A címzett nem található')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).render('uzenetek', { felhasznalo: req.felhasznalo, message: 'Hiba a validalas soran!' });
    }
    const felhasznaloID = (await db.getFelhasznaloID(req.felhasznalo.Nev))[0].FelhasznaloID;
    const uzenetek = await db.getUzenetek(felhasznaloID, req.body.felhasznaloValaszto2);
    const olvasva = await db.olvasottUzenet(felhasznaloID, req.body.felhasznaloValaszto2);
    if (olvasva === true || olvasva === false) {
      if (uzenetek.length > 0) {
        return res.render('uzenetekmegtekintes', { felhasznalo: req.felhasznalo, uzenetek });
      }
    }
    return res.render('uzenetek');
  },
);
router.delete('/hirdetesUserDelete/:id', verifyToken, checkOwner, async (req, res) => {
  try {
    const { id } = req.params;
    const kepek = await db.getPic(id);
    if (kepek.length > 0) {
      kepek.forEach((kep) => {
        const toroltKep = db.deletePic(kep.FenykepID);
        if (!toroltKep) {
          return res.status(500).json({ message: 'A kép törlése nem sikerült' });
        }
        fs.unlinkSync(path.join(uploadDir, kep.Fajlnev));
        return 2;
      });
    }
    const torolt = await db.deleteHirdetes(id);
    if (torolt) {
      return res.status(200).end();
    }
    return res.status(500).json({ message: 'A hirdetés törlése nem sikerült' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Szerverhiba' });
  }
});
export default router;
