import express from "express";

import { register, login, logout } from "../controllers/authControllers.js";

const usersRouter = express.Router();
import validateBody from "../middlewares/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/usersSchemas.js";
import {
  getCurrentUser,
  updateAvatar,
} from "../controllers/usersControllers.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";
usersRouter.post("/register", validateBody(registerSchema), register);
usersRouter.post("/login", validateBody(loginSchema), login);
usersRouter.post("/logout", auth, logout);
usersRouter.get("/current", auth, getCurrentUser);
usersRouter.patch("/avatars", auth, upload.single("avatarURL"), updateAvatar);

export default usersRouter;
