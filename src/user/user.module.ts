import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";
import { PrismaModule } from "@/prisma/prisma.module";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";

@Module({
    imports: [forwardRef(() => AuthModule), PrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
