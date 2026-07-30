const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const PRIVY_APP_ID = process.env.PRIVY_APP_ID;

// JWKS client for Privy's public keys
const client = jwksClient({
  jwksUri: `https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 600000, // Cache keys for 10 minutes
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error('JWKS signing key error:', err.message);
      return callback(err);
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // In development, allow fallback to decode-only if JWKS is unavailable
  if (process.env.NODE_ENV === 'development') {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.sub) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
      }
      req.user = { id: decoded.sub };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Token decode failed' });
    }
  }

  // Production: Verify JWT signature against Privy JWKS
  jwt.verify(token, getKey, {
    issuer: `privy.io/${PRIVY_APP_ID}`,
    algorithms: ['ES256'],
  }, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
    }

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token claims' });
    }

    req.user = { id: decoded.sub };
    next();
  });
};

module.exports = authMiddleware;
