import * as db from '../db/db.js';

export default async function checkAdmin(req, res, next) {
  const admin = await db.checkAdmin(req.felhasznalo.Nev);
  if (admin.length > 0) {
    next();
  } else {
    res.status(403).send('Nem vagy admin!');
  }
}
