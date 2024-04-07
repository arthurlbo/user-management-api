import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetPasswordDTO {
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsJWT()
    token: string;
}
