const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.auth = async (req, res, next) => {
  try {
    console.log("Auth middleware called");
    console.log("Headers:", req.headers);
    console.log("Authorization header:", req.header("Authorization"));

    // Extract token from various sources
    let token =
      (req.cookies && req.cookies.token) ||
      req.body.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

    console.log("Extracted token:", token);

    if (!token) {
      console.log("No token found!");
      return res.status(401).json({ 
        success: false, 
        message: "Token Missing" 
      });
    }

    try {
      // Verify JWT using secret key
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("Decoded user in auth:", decode);
    } catch (error) {
      console.log("JWT verification error:", error.message);
      return res.status(401).json({ 
        success: false, 
        message: "Token is invalid" 
      });
    }

    next();
  } catch (error) {
    console.log("General auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token"
    });
  }
};

// Optional auth - doesn't fail if no token
exports.optionalAuth = async (req, res, next) => {
  try {
    let token =
      (req.cookies && req.cookies.token) ||
      req.body.token ||
      (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));

    if (token) {
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
      } catch (error) {
        // Token invalid, but continue without user
        console.log("Optional auth failed, continuing without user");
      }
    }

    next();
  } catch (error) {
    next();
  }
};