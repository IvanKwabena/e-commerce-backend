const { expressjwt: expressJwt } = require('express-jwt');
require('dotenv').config();

function isAdmin(req, res, next) {
  if (!req.auth.isAdmin) {
    return res.status(403).send('User is not an Admin');
  }
  response.end('Contact Admin - Not Working\n');
  console.log('stupid');
  next();
}

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
