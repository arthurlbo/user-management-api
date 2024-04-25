import { IsEmail } from "class-validator";

export class ForgotPasswordAuthDTO {
    @IsEmail()
    email: string;
}
