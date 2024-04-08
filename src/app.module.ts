import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";

import { AuthModule } from "@/auth/auth.module";
import { UserModule } from "@/user/user.module";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000,
                limit: 10,
            },
        ]),
        ConfigModule.forRoot(),
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [AppService],
})
export class AppModule {}
