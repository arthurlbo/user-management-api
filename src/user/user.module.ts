import { forwardRef, Module } from "@nestjs/common";

import { UserService } from "./user.service";
import { AuthModule } from "src/auth/auth.module";
import { UserController } from "./user.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [forwardRef(() => AuthModule), PrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
