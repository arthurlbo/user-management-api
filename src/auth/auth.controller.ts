import { extname, join } from "path";

import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import {
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";

import { User as UserType } from "@prisma/client";

import { AuthGuard } from "@/guards/auth.guard";
import { FileService } from "@/file/file.service";
import { User } from "@/decorators/user.decorator";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { AuthService } from "./auth.service";

import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthUpdateDTO } from "./dto/auth-update.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthResetPasswordDTO } from "./dto/auth-reset-password.dto";
import { AuthUpdatePartialDTO } from "./dto/auth-update-partial.dto";
import { AuthForgotPasswordDTO } from "./dto/auth-forgot-password.dto";

const MAX_FILE_SIZE = 5_242_880; // 5MB
const FILE_TYPE = /image\/(jpeg|jpg|png|webp|svg)$/;

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService,
    ) {}

    @Post("register")
    @UseInterceptors(EmailInterceptor)
    async register(@Body() data: AuthRegisterDTO) {
        return this.authService.register(data);
    }

    @Post("login")
    async login(@Body() data: AuthLoginDTO) {
        return this.authService.login(data);
    }

    @UseGuards(AuthGuard)
    @Post("me")
    async me(@User() user: UserType) {
        delete user["password"];

        return { data: user };
    }

    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @Post("avatar")
    async uploadAvatar(
        @User() user: UserType,
        @Req() req: Request,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: FILE_TYPE }),
                    new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
                ],
            }),
        )
        avatar: Express.Multer.File,
    ) {
        const extension = extname(avatar.originalname);
        const fileName = user.id.concat(extension);

        const path = join(process.cwd(), "storage", "avatars", fileName);

        return this.fileService.upload(req, avatar, path);
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    @UseInterceptors(EmailInterceptor)
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: AuthUpdateDTO, @User() user: UserType) {
        return this.authService.update(id, data, user);
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    @UseInterceptors(EmailInterceptor)
    async updatePartial(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() data: AuthUpdatePartialDTO,
        @User() user: UserType,
    ) {
        return this.authService.updatePartial(id, data, user);
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
