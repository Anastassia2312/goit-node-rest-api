import User from "../model/usersModel.js";

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
