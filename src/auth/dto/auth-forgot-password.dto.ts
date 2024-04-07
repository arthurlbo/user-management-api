import { IsEmail } from "class-validator";

export class AuthForgotPasswordDTO {
    @IsEmail()
    email: string;
}
