import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import MESSAGES from "../services/messages.js";

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ status: "error", message: MESSAGES.AUTH.MISSING_TOKEN });
  }

  const token = req.headers.authorization.replace(/['"]/g, "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.id || !payload.role) {
      return res.status(401).send({ status: "error", message: MESSAGES.AUTH.INVALID_TOKEN });
    }

    req.user = { id: payload.id, role: payload.role };

    const user = await User.findById(req.user.id);
    if (user.isBanned) {
      return res.status(403).send({ status: "banned", message: MESSAGES.AUTH.BANNED });
    }

    next();
  } catch (error) {
    return res.status(401).send({
      status: "error",
      message: MESSAGES.AUTH.INVALID_TOKEN,
      error: error.message,
    });
  }
};

export default auth;
