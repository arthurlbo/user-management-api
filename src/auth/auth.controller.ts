import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";

import { User as UserType } from "@prisma/client";

import { User } from "@/decorators/user.decorator";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { AuthService } from "./auth.service";

import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetPasswordDTO } from "./dto/auth-reset-password.dto";
import { AuthForgotPasswordDTO } from "./dto/auth-forgot-password.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("me")
    async me(@User() user: UserType | string | Date) {
        delete user["password"];

        return { data: user };
    }

    @Post("login")
    async login(@Body() data: AuthLoginDTO) {
        return this.authService.login(data);
    }

    @Post("register")
    @UseInterceptors(EmailInterceptor)
    async register(@Body() data: AuthRegisterDTO) {
        return this.authService.register(data);
    }

    @Post("forgot-password")
    async forgotPassword(@Body() data: AuthForgotPasswordDTO) {
        return this.authService.forgotPassword(data);
    }

    @Post("reset-password")
    async resetPassword(@Body() data: AuthResetPasswordDTO) {
        return this.authService.resetPassword(data);
    }
}
