const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Note: In production, verify the Privy JWT signature against Privy's JWKS.
    // For Phase 1 scaffolding, we decode it to extract the Privy user ID (sub).
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
       return res.status(401).json({ error: 'Unauthorized: Invalid token format' });
    }
    
    // Attach the privy user ID to the request object
    req.user = { id: decoded.sub };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};

module.exports = authMiddleware;
