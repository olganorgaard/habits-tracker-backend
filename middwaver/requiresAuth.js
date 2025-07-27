function requiresAuthMiddleware(req, res, next) {
  if (req.oidc?.isAuthenticated?.()) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized: Please log in.' });
}

module.exports = requiresAuthMiddleware;
