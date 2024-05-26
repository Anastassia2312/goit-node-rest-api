import User from "../model/usersModel.js";
import path from "node:path";
import * as fs from "node:fs/promises";
import HttpError from "../helpers/HttpError.js";
import { jimpAvatar } from "../helpers/jimpAvatar.js";
export const getCurrentUser = async (req, res, next) => {
  try {
    const { token } = req.user;
    const result = await User.findOne({ token });
    const { email, subscription } = result;
    console.log(result);
    res.status(200).json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id: id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    await jimpAvatar(tmpUpload);
    const fileName = `${id}-${originalname}`;
    const resultUpload = path.resolve("public/avatars", fileName);
    await fs.rename(tmpUpload, resultUpload);
    const avatarURL = path.resolve("avatars", fileName);
    const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verify = async (req, res, next) => {
  try {
    const { verifyToken } = req.params;
    const user = await User.findOne({ verificationToken: verifyToken });

    if (!user) {
      throw HttpError(404, "User not found");
    }
    const id = user._id;
    await User.findByIdAndUpdate(id, { verify: true, verificationToken: null });
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw HttpError(400, "missing required field email");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    if (user.verify === true) {
      throw HttpError(400, "Verification has already been passed");
    }
    await User.updateOne(
      { email: email },
      {
        verify: true,
        verificationToken: null,
      }
    );
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
