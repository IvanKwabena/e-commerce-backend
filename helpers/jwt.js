const { expressjwt: expressJwt } = require('express-jwt');
// const jwt = require('jsonwebtoken');

require('dotenv').config();

function isAdmin(req, res, next) {
  if (!req.auth.isAdmin) {
    return res.status(403).send('User is not an Admin');
  }
  next();
}

// const secret = process.env.API_ACCESS_TOKEN;

// const verifyToken = (req, res, next) => {
//   const token = req.body.token || req.query.token || req.headers.authorization;
//   console.log(token);

//   if (!token) {
//     return res.status(403).send('A token is required for authentication');
//   }
//   try {
//     if (req.auth.isAdmin) {
//       const decoded = jwt.verify(token, secret);
//       req.user = decoded;
//     } else {
//       return res.status(403).send('User is not an Admin');
//     }
//   } catch (err) {
//     return res.status(401).send('Invalid Token');
//   }
//   return next();
// };

function authJwt() {
  const api = process.env.API_URL;
  const secret = process.env.API_ACCESS_TOKEN;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
      { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

module.exports = { authJwt, isAdmin };
