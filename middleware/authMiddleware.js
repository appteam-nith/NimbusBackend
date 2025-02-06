const jwt = require('jsonwebtoken');
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Authorization token required' });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        console.log('Decoded token:', decoded); 
        next();
    });
};


exports.authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Role ${req.user.role} is not authorized to access this resource`
            });
        }
        next();
    };
};

exports.authorizeClubAccess = () => {
    return async (req, res, next) => {
      if (req.user.role === 'clubAdmin') {
        const club = await Club.findById(req.params.clubId);
        if (!club || club._id.toString() !== req.user.clubId.toString()) {
          return res.status(403).json({ message: 'Unauthorized club access' });
        }
      }
      next();
    };
  };