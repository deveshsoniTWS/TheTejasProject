import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

/**
 * Reusable validation middleware that behaves exactly like NestJS ValidationPipe.
 */
export function validateBody(schema: ZodSchema<any>) { // 👈 Added <any> here!
    return (req: Request, res: Response, next: NextFunction): void => {
        const parseResult = schema.safeParse(req.body);

        if (!parseResult.success) {
            // 👈 Changed .errors to .issues. Now TS perfectly infers `err` type!
            const errorMessages = parseResult.error.issues.map(
                (err) => `${err.path.join(".")}: ${err.message}`
            );

            res.status(400).json({
                statusCode: 400,
                message: errorMessages,
                error: "Bad Request",
            });
            return;
        }

        // Replace req.body with the parsed/cleaned data
        req.body = parseResult.data;
        next();
    };
}
