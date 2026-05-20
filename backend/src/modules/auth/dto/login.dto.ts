import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    userName!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}