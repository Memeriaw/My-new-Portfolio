const jwt = require('jsonwebtoken');

const protectAdmin = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const [scheme, token, ...extra] = authorization.trim().split(/\s+/);

  if (!token || scheme.toLowerCase() !== 'bearer' || extra.length > 0) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error('JWT_SECRET must be configured before admin authentication can be used.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof decoded !== 'object' || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route. Administrator role required.'
      });
    }
    req.admin = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

module.exports = {
  protectAdmin
};
