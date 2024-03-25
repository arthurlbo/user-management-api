import { Module } from "@nestjs/common";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

import { UserModule } from "./user/user.module";

@Module({
    imports: [UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
