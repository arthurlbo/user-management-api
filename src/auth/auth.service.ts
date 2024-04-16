import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";

import { UserService } from "@/user/user.service";
import { PrismaService } from "@/prisma/prisma.service";

import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthUpdateDTO } from "./dto/auth-update.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetPasswordDTO } from "./dto/auth-reset-password.dto";
import { AuthUpdatePartialDTO } from "./dto/auth-update-partial.dto";
import { AuthForgotPasswordDTO } from "./dto/auth-forgot-password.dto";

interface GenerateJWTConfig {
    expiresIn?: string;
    issuer?: string;
    audience?: string;
}

interface VerifyJWTConfig extends Omit<GenerateJWTConfig, "expiresIn"> {}

@Injectable()
export class AuthService {
    private readonly audience = "users";
    private readonly issuer = "Authentication";

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
    ) {}

    private async generateToken(id: User["id"], config: GenerateJWTConfig = {}) {
        const defaultConfig: GenerateJWTConfig = { expiresIn: "30 days", issuer: this.issuer, audience: this.audience };

        const { expiresIn, issuer, audience } = { ...defaultConfig, ...config };

        const token = this.jwtService.sign(
            {
                id,
            },
            {
                subject: id,
                expiresIn,
                issuer,
                audience,
            },
        );

        return { token };
    }

    async verifyToken(token: string, config: VerifyJWTConfig = {}): Promise<{ id: User["id"] }> {
        const defaultConfig: VerifyJWTConfig = { issuer: this.issuer, audience: this.audience };

        const { issuer, audience } = { ...defaultConfig, ...config };

        try {
            const data = this.jwtService.verify(token, {
                issuer,
                audience,
            });

            return data;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    async register(data: AuthRegisterDTO) {
        const newUser = await this.userService.create(data);

        return this.generateToken(newUser.id);
    }

    async login({ email, password }: AuthLoginDTO) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Email or password is incorrect.");
        }

        return this.generateToken(user.id);
    }

    async update(id: string, data: AuthUpdateDTO) {
        return this.userService.update(id, data);
    }

    async updatePartial(id: string, data: AuthUpdatePartialDTO) {
        return this.userService.updatePartial(id, data);
    }

    async forgotPassword({ email }: AuthForgotPasswordDTO) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException("User not found.");
        }

        const { token } = await this.generateToken(user.id, {
            expiresIn: "10 minutes",
            issuer: "Forgot Password",
        });

        await this.mailerService.sendMail({
            subject: "Forgot Password",
            to: email,
            template: "forgot-password",
            context: {
                name: user.name,
                token,
            },
        });

        return true;
    }

    async resetPassword({ password, token }: AuthResetPasswordDTO) {
        try {
            const { id } = await this.verifyToken(token, { issuer: "Forgot Password" });

            const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

            const user = await this.prismaService.user.update({
                where: {
                    id,
                },
                data: {
                    password: hashedPassword,
                },
            });

            return this.generateToken(user.id);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
