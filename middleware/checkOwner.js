import * as db from '../db/db.js';

export default async function checkOwner(req, res, next) {
  try {
    if (!req.felhasznalo) {
      return res.status(401).send('Nem vagy bejelentkezve');
    }
    const felhasznaloID = (await db.getFelhasznaloID(req.felhasznalo.Nev))[0].FelhasznaloID;
    let adID;
    if (req.body && req.body.adId) {
      adID = req.body.adId;
    } else {
      adID = req.params.id;
    }
    const hirdetes = await db.checkFelhasznaloOwner(felhasznaloID, adID);
    if (hirdetes.length === 0) {
      return res.status(403).send('Nem vagy a hirdetés tulajdonosa');
    }

    return next();
  } catch (error) {
    return res.status(500).send('Hiba történt az ellenőrzés során');
  }
}
