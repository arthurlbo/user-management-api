import { Module } from "@nestjs/common";

import { AuthModule } from "@/auth/auth.module";
import { UserModule } from "@/user/user.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
    imports: [AuthModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
