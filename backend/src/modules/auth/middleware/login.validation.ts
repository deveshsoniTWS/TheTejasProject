import { Request, Response, NextFunction } from "express";

export function validateLoginBody(req: Request, res: Response, next: NextFunction): void {
    const { userName, password } = req.body;
    const errors: string[] = [];

    if (userName === undefined || userName === null) {
        errors.push("userName should not be empty");
    } else if (typeof userName !== "string") {
        errors.push("userName must be a string");
    } else if (userName.trim() === "") {
        errors.push("userName should not be empty");
    }

    if (password === undefined || password === null) {
        errors.push("password should not be empty");
    } else if (typeof password !== "string") {
        errors.push("password must be a string");
    } else if (password.trim() === "") {
        errors.push("password should not be empty");
    }

    if (errors.length > 0) {
        res.status(400).json({
            statusCode: 400,
            message: errors,
            error: "Bad Request",
        });
        return;
    }

    next();
}
