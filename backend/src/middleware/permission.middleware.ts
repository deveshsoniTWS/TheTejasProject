import { Request, Response, NextFunction } from "express";
import { Role } from "../constants/constants.js";

/**
 * Higher-order middleware to restrict routes by specific permission names.
 * Automatically bypasses checks if the user has the 'SuperAdmin' role.
 */
export function requirePermission(requiredPermission: string) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user;

        // 1. Guard against unauthenticated requests reaching this check
        if (!user) {
            res.status(401).json({
                statusCode: 401,
                message: "Unauthorized - User session not found",
            });
            return;
        }

        // 2. Bypass authorization entirely if they are a SuperAdmin
        if (user.roles.includes(Role.SUPER_ADMIN)) {
            next();
            return;
        }

        // 3. Check if the user's flat permission array has the required permission
        if (!user.permissions.includes(requiredPermission)) {
            res.status(403).json({
                statusCode: 403,
                message: "Forbidden - Insufficient permissions",
            });
            return;
        }

        next(); // All checks passed!
    };
}
