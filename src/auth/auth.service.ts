import { JwtService } from "@nestjs/jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "@prisma/client";
import { UserService } from "@/user/user.service";
import { PrismaService } from "@/prisma/prisma.service";

import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgotPasswordDTO } from "./dto/auth-forgot-password.dto";
import { AuthResetPasswordDTO } from "./dto/auth-reset-password.dto";

@Injectable()
export class AuthService {
    private readonly audience = "users";
    private readonly issuer = "Auth Service";

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
    ) {}

    async generateToken({ id }: User) {
        const token = this.jwtService.sign(
            {
                id,
            },
            {
                subject: id,
                expiresIn: "30 days",
                issuer: this.issuer,
                audience: this.audience,
            },
        );

        return { token };
    }

    async verifyToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience,
            });

            return data;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async register(data: AuthRegisterDTO) {
        const userExists = await this.prisma.user.findFirst({
            where: {
                email: data.email,
            },
        });

        if (userExists) {
            throw new UnauthorizedException("User already exists.");
        }

        const newUser = await this.userService.create(data);

        return this.generateToken(newUser);
    }

    async login({ email, password }: AuthLoginDTO) {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
                password,
            },
        });

        if (!user) {
            throw new UnauthorizedException("Email or password is incorrect.");
        }

        return this.generateToken(user);
    }

    async forgotPassword({ email }: AuthForgotPasswordDTO) {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException("User not found.");
        }

        // TODO - Send email with reset password link
        return true;
    }

    async resetPassword({ password, token }: AuthResetPasswordDTO) {
        // TODO - Verify token and get user id

        const id = "";

        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password,
            },
        });

        return this.generateToken(user);
    }
}
