import { z } from "zod";

export const LoginSchema = z.object({
    userName: z.string({ message: "userName is required" }).min(1, "userName should not be empty"),
    password: z.string({ message: "password is required" }).min(1, "password should not be empty"),
});

export type LoginDto = z.infer<typeof LoginSchema>;
