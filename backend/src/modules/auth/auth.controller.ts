import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // 1. login method
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userName, password } = req.body;
            const result = await this.authService.login({ userName, password });
            res.status(200).json(result);
        } catch (error) {
            next(error); // Passes the error to Express global error handler
        }
    }

    // 2. logout method
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = this.authService.logout();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    // 3. refresh method
    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refresh(refreshToken);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
