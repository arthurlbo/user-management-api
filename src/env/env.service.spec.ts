import { Test, TestingModule } from "@nestjs/testing";

import { EnvService } from "@/env/env.service";
import { envSchema } from "@/common/schemas/env.schema";

describe("EnvService", () => {
    let envService: EnvService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EnvService],
        }).compile();

        envService = module.get<EnvService>(EnvService);
    });

    describe("Definitions", () => {
        it("should define envService correctly", () => {
            expect(envService).toBeDefined();
        });
    });

    describe("Validations", () => {
        it("should validate correct environment variables", () => {
            const validEnv = {
                NODE_ENV: "test",
                DATABASE_URL: "http://localhost:5432",
                JWT_SECRET: "secret",
                MAIL_HOST: "smtp.mailtrap.io",
                MAIL_PORT: "2525",
                MAIL_USER: "user",
                MAIL_PASS: "password",
                POSTGRES_HOST: "postgres",
                POSTGRES_PORT: "5432",
                POSTGRES_USER: "user",
                POSTGRES_PASSWORD: "password",
                POSTGRES_DB: "db",
                PGADMIN_DEFAULT_EMAIL: "email@email.com",
                PGADMIN_DEFAULT_PASSWORD: "password",
            };
            expect(() => envSchema.parse(validEnv)).not.toThrow();
        });

        it("should throw error for missing NODE_ENV", () => {
            const invalidEnv = {
                DATABASE_URL: "http://localhost:5432",
                JWT_SECRET: "secret",
                MAIL_HOST: "smtp.mailtrap.io",
                MAIL_PORT: "2525",
                MAIL_USER: "user",
                MAIL_PASS: "pass",
            };
            expect(() => envSchema.parse(invalidEnv)).toThrow();
        });

        it("should throw error for invalid DATABASE_URL", () => {
            const invalidEnv = {
                NODE_ENV: "test",
                DATABASE_URL: "invalid_url",
                JWT_SECRET: "secret",
                MAIL_HOST: "smtp.mailtrap.io",
                MAIL_PORT: "2525",
                MAIL_USER: "user",
                MAIL_PASS: "pass",
            };
            expect(() => envSchema.parse(invalidEnv)).toThrow();
        });
    });
});
