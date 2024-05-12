import jwt from "jsonwebtoken";
import User from "../model/usersModel.js";
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY;

const auth = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader === "undefined") {
    return next(HttpError(401, "Not authorized"));
  }
  const [bearer, token] = authorizationHeader.split(" ", 2);

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    next(HttpError(401, "Not authorized"));
  }
};

export default auth;
