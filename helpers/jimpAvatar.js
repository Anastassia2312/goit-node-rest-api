import Jimp from "jimp";

export const jimpAvatar = async (filePath) => {
  try {
    const image = await Jimp.read(filePath);
    image.resize(250, 250);
    image.writeAsync(filePath);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
