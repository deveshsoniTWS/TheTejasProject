import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function validateBody<T extends object>(DtoClass: new () => T) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const instance = plainToInstance(DtoClass, req.body);
        const errors = await validate(instance);

        if (errors.length) {
            const messages = errors.flatMap(e => Object.values(e.constraints || {}));
            res.status(400).json({ statusCode: 400, message: messages, error: "Bad Request" });
            return;
        }

        req.body = instance;
        next();
    };
}