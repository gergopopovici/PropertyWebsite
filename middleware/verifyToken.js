import jwt from 'jsonwebtoken';

const secret = '92e001516475925247579858f731b6c65f178002bbb93c12cf3b09afeaceeca6';
export default function verifyToken(req, res, next) {
  const { loginToken } = req.cookies;
  if (loginToken) {
    try {
      const decoded = jwt.verify(loginToken, secret);
      req.felhasznalo = decoded.felhasznalo;
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.cookie('loginToken', '', { expires: new Date(0) });
        return res.redirect('/index');
      }
      return next(err);
    }
  } else {
    return next();
  }
}
