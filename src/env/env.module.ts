import { Module, OnModuleInit } from "@nestjs/common";

import { EnvService } from "./env.service";

@Module({
    providers: [EnvService],
})
export class EnvModule implements OnModuleInit {
    constructor(private readonly envService: EnvService) {}

    onModuleInit() {
        this.envService.validateEnv();
    }
}
