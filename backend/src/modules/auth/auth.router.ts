import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticateJWT } from "./middleware/jwt.middleware.js";
import { validateBody } from "./middleware/validation.middleware.js";
import { LoginSchema } from "./dto/login.dto.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", validateBody(LoginSchema), (req, res, next) => authController.login(req, res, next));

authRouter.post("/logout", authenticateJWT, (req, res, next) => authController.logout(req, res, next));

authRouter.post("/refresh", (req, res, next) => authController.refresh(req, res, next));

export default authRouter;