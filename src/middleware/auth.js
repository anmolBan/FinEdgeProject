const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Authentication required');
    err.statusCode = 401;
    return next(err);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecretkey');
    // Attach user info to request for downstream handlers
    req.user = { id: payload.id };
    next();
  } catch (e) {
    const err = new Error('Invalid or expired token');
    err.statusCode = 401;
    return next(err);
  }
}

module.exports = auth;
