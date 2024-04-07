import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { User as UserType } from "@prisma/client";

import { AuthGuard } from "@/guards/auth.guard";
import { User } from "@/decorators/user.decorator";

import { AuthService } from "./auth.service";

import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetPasswordDTO } from "./dto/auth-reset-password.dto";
import { AuthForgotPasswordDTO } from "./dto/auth-forgot-password.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard)
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
