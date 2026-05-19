import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authenticateJWT } from "./middleware/jwt.middleware.js";
import { validateBody } from "./middleware/validation.middleware.js";
import { LoginSchema } from "./dto/login.dto.js";

const router = Router();
const authController = new AuthController();

router.post("/login", validateBody(LoginSchema), (req, res, next) => authController.login(req, res, next));

router.post("/logout", authenticateJWT, (req, res, next) => authController.logout(req, res, next));

router.post("/refresh", (req, res, next) => authController.refresh(req, res, next));

export default router;