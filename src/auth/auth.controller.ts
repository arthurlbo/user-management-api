import { extname, join } from "path";

import { Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import {
    Body,
    Controller,
    FileTypeValidator,
    Get,
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

import { AuthGuard } from "@/guards/auth.guard";
import { FileService } from "@/file/file.service";
import { User } from "@/decorators/user.decorator";
import { UserEntity } from "@/user/entity/user.entity";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { AuthService } from "./auth.service";

import { LoginAuthDTO } from "./dto/login-auth.dto";
import { UpdateAuthDTO } from "./dto/update-auth.dto";
import { RegisterAuthDTO } from "./dto/register-auth.dto";
import { UpdatePartialAuthDTO } from "./dto/update-partial-auth.dto";
import { ResetPasswordAuthDTO } from "./dto/reset-password-auth.dto";
import { ForgotPasswordAuthDTO } from "./dto/forgot-password-auth.dto";

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
    async register(@Body() data: RegisterAuthDTO) {
        return this.authService.register(data);
    }

    @Post("login")
    async login(@Body() data: LoginAuthDTO) {
        return this.authService.login(data);
    }

    @UseGuards(AuthGuard)
    @Get("me")
    async me(@User() user: UserEntity) {
        delete user["password"];

        return user;
    }

    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @Post("avatar")
    async uploadAvatar(
        @User() user: UserEntity,
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
    async update(@Param("id", ParseUUIDPipe) id: string, @Body() data: UpdateAuthDTO, @User() user: UserEntity) {
        return this.authService.update(id, data, user);
    }

    @Patch(":id")
    @UseGuards(AuthGuard)
    @UseInterceptors(EmailInterceptor)
    async updatePartial(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() data: UpdatePartialAuthDTO,
        @User() user: UserEntity,
    ) {
        return this.authService.updatePartial(id, data, user);
    }

    @Post("forgot-password")
    async forgotPassword(@Body() data: ForgotPasswordAuthDTO) {
        return this.authService.forgotPassword(data);
    }

    @Post("reset-password")
    async resetPassword(@Body() data: ResetPasswordAuthDTO) {
        return this.authService.resetPassword(data);
    }
}
