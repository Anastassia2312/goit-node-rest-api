import HttpError from "../helpers/HttpError.js";
import crypto from "node:crypto";
import User from "../model/usersModel.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import mail from "../services/mail.js";

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res, next) => {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const verificationToken = crypto.randomUUID();
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      subscription,
      avatarURL,
      verificationToken,
    });
    mail.sendMail({
      to: email,
      from: "23122000na@gmail.com",
      subject: "Email verification",
      html: `Please, confirm your email and click on the <a href="http://localhost:3000/users/verify/${verificationToken}">link</a>`,
      text: `Confirm your email, please open the link http://localhost:3000/users/verify/${verificationToken}`,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    if (user.verificationToken === false) {
      throw HttpError(404, "User not found");
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(
      user._id,
      { token },
      {
        new: true,
      }
    );
    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByIdAndUpdate(id, { token: null });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(204).json("No content");
  } catch (error) {
    next(error);
  }
};
