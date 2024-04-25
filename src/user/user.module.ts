import { TypeOrmModule } from "@nestjs/typeorm";
import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";

import { UserService } from "./user.service";
import { UserEntity } from "./entity/user.entity";
import { UserController } from "./user.controller";

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule {}
