import { Injectable, Logger } from "@nestjs/common";

import { envSchema } from "@/common/schemas/env.schema";

@Injectable()
export class EnvService {
    private readonly logger = new Logger(EnvService.name);

    validateEnv() {
        try {
            envSchema.parse(process.env);
            this.logger.log("Environment variables successfully validated.");
        } catch (e) {
            this.logger.error("Invalid environment variables", e.message);
            process.exit(1);
        }
    }
}
