import { JwtModule } from "@nestjs/jwt";
import { forwardRef, Module } from "@nestjs/common";

import { FileModule } from "@/file/file.module";
import { UserModule } from "@/user/user.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
        }),
        PrismaModule,
        FileModule,
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
