import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { UserService } from "@/user/user.service";
import { UserEntity } from "@/user/entity/user.entity";

import { LoginAuthDTO } from "./dto/login-auth.dto";
import { UpdateAuthDTO } from "./dto/update-auth.dto";
import { RegisterAuthDTO } from "./dto/register-auth.dto";
import { UpdatePartialAuthDTO } from "./dto/update-partial-auth.dto";
import { ResetPasswordAuthDTO } from "./dto/reset-password-auth.dto";
import { ForgotPasswordAuthDTO } from "./dto/forgot-password-auth.dto";

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
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    private async generateToken(id: UserEntity["id"], config: GenerateJWTConfig = {}) {
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

    async verifyToken(token: string, config: VerifyJWTConfig = {}): Promise<{ id: UserEntity["id"] }> {
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

    private async itIsUsersId(requestId: string, userId: string) {
        if (requestId !== userId) {
            throw new UnauthorizedException(
                "You are trying to update a user that is not yourself. Please, make sure you are updating your own user.",
            );
        }
    }

    async register(data: RegisterAuthDTO) {
        const newUser = await this.userService.create(data);

        return this.generateToken(newUser.id);
    }

    async login({ email, password }: LoginAuthDTO) {
        const user = await this.usersRepository.findOneBy({
            email,
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException("Email or password is incorrect.");
        }

        return this.generateToken(user.id);
    }

    async update(id: string, { birthDate, password, ...rest }: UpdateAuthDTO, user: UserEntity) {
        await this.itIsUsersId(id, user.id);

        return this.userService.update(id, { ...rest, birthDate, password });
    }

    async updatePartial(id: string, { birthDate, password, ...rest }: UpdatePartialAuthDTO, user: UserEntity) {
        await this.itIsUsersId(id, user.id);

        return this.userService.updatePartial(id, { ...rest, birthDate, password });
    }

    async forgotPassword({ email }: ForgotPasswordAuthDTO) {
        const user = await this.usersRepository.findOneBy({
            email,
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

    async resetPassword({ password, token }: ResetPasswordAuthDTO) {
        try {
            const { id } = await this.verifyToken(token, { issuer: "Forgot Password" });

            const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

            await this.usersRepository.update(id, {
                password: hashedPassword,
            });

            const user = await this.userService.findOne(id);

            return this.generateToken(user.id);
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
