import jwt from "jsonwebtoken";
import config from "../config.js";

const authMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "User not logged in" });
    }
    const decodedData = jwt.verify(token, config.secret);

    req.user = decodedData;
    next();
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User not logged in" });
  }
};

export default authMiddleware;
