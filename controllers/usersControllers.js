import User from "../model/usersModel.js";
import path from "node:path";
import * as fs from "node:fs/promises";
import HttpError from "../helpers/HttpError.js";
import { jimpAvatar } from "../helpers/jimpAvatar.js";
export const getCurrentUser = async (req, res, next) => {
  try {
    const { token } = req.user;
    console.log(req.user);
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
    const avatarURL = path.join("avatars", fileName);
    console.log(avatarURL);
    const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
