const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../utils/key");

const withToken = async (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      return res.status(401).json({ error: "Missing Authorization Header" });
    }

    const [bearer, token] = req.headers["authorization"].split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid Authorization Method" });
    }

    const tokenDecoded = jwt.verify(token, JWT_KEY);

    if (!tokenDecoded) {
      return res.status(401).json({ error: "Invalid Token" });
    }
    req.user = {
      token: tokenDecoded,
    };
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: e.message });
  }
};

module.exports = {
  withToken,
};
