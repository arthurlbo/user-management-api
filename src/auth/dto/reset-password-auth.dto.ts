import { IsJWT, IsStrongPassword } from "class-validator";

export class ResetPasswordAuthDTO {
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
