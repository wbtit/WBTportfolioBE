import jwt from 'jsonwebtoken';

export const Authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization']; // lowercase key

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1]; // extract the token part after 'Bearer '

  try {
    const payload = jwt.verify(token, process.env.SECRET); // verify JWT
    req.user = payload; // attach payload to request
    next(); // move to next middleware or route
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      data: null,
    });
  }
};
