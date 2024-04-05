import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";

import { UserModule } from "./user/user.module";
import { IdValidationMiddleware } from "./middlewares/id-validation.middleware";

@Module({
    imports: [UserModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    // The ParseUUIDPipe is a built-in pipe that validates the UUID format already, this is only for study purposes.
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(IdValidationMiddleware).forRoutes({
            path: "*/:id",
            method: RequestMethod.ALL,
        });
    }
}
