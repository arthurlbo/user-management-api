import * as z from "zod";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"], {
        description: "Environment that the app is running in",
        required_error: "😱 You forgot to add the environment",
    }),
    DATABASE_URL: z
        .string({
            description: "Database connection string",
            required_error: "😱 You forgot to add a database URL",
        })
        .url(),
    JWT_SECRET: z.string({ description: "Secret key for JWT", required_error: "😱 You forgot to add a JWT secret" }),
    MAIL_HOST: z.string({ description: "Host of the mail server", required_error: "😱 You forgot to add a mail host" }),
    MAIL_PORT: z.string({
        description: "Port of the mail server",
        required_error: "😱 You forgot to add a mail port",
    }),
    MAIL_USER: z.string({
        description: "User of the mail server",
        required_error: "😱 You forgot to add the mail user",
    }),
    MAIL_PASS: z.string({
        description: "Password of the mail server",
        required_error: "😱 You forgot to add a password to the mail server",
    }),
});

type Env = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}
