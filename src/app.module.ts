import { join } from "path";

import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";

import { AuthModule } from "@/auth/auth.module";
import { UserModule } from "@/user/user.module";
import { UserEntity } from "@/user/entity/user.entity";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000,
                limit: 10,
            },
        ]),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: +process.env.MAIL_PORT,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
            },
            defaults: {
                from: `"Arthur" ${process.env.MAIL_USER}`,
            },
            template: {
                dir: join(process.cwd(), "src", "templates"),
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [UserEntity],
            synchronize: process.env.NODE_ENV === "development",
        }),
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
