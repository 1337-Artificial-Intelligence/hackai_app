const jwt = require('jsonwebtoken');
const Team = require('../models/team.model');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const team = await Team.findById(decoded.id);

      if (!team) {
        return res.status(401).json({ message: 'No team found with this id' });
      }

      req.user = {
        id: team._id,
        teamName: team.teamName,
        role: team.role
      };

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (err) {
    next(err);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: `Role ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};
