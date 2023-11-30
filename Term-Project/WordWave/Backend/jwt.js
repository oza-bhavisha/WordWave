const jwt = require("jsonwebtoken");

const secretKey = "seceret";

function generateJWT(payload) {
  return jwt.sign(payload, secretKey, { expiresIn: 60000 });
}

function verifyJWT(req, res, next) {
  const { headers } = req;
  const { authorization } = headers;
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error verifying JWT:", error.message);
    return null;
  }
}

module.exports = { generateJWT, verifyJWT };
