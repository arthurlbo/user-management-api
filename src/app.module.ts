import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [AuthModule, UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
