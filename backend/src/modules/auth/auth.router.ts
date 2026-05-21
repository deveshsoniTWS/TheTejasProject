import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";
import { validateLoginBody } from "./middleware/login.validation";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", validateLoginBody, authController.login);
authRouter.post("/refresh", authController.refresh);

const protectedRouter = Router();

protectedRouter.use(authenticateJWT);

protectedRouter.post("/logout", authController.logout);

authRouter.use(protectedRouter);

export default authRouter;