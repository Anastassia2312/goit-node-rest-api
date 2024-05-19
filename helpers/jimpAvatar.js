import Jimp from "jimp";

export const jimpAvatar = async (filePath) => {
  try {
    const image = await Jimp.read(filePath);
    return image.resize(250, 250);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
