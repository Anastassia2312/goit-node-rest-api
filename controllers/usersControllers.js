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
    const jimp = await jimpAvatar(tmpUpload);

    const fileName = `${id}-${originalname}`;
    await fs.rename(jimp, path.resolve("public/avatars", fileName));
    const avatarURL = path.resolve("avatars", fileName);
    const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
    console.log(user);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};
