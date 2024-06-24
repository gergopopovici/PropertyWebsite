export default function checkAuth(req, res, next) {
  if (req.felhasznalo) {
    return next();
  }
  return res.redirect('/login');
}
