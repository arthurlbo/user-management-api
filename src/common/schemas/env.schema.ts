import * as z from "zod";

export const schema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"], {
        description: "Environment that the app is running in",
        required_error: "😱 You forgot to add the environment",
    }),
    POSTGRES_HOST: z.string({ description: "Postgres host", required_error: "😱 You forgot to add a Postgres host" }),
    POSTGRES_PORT: z.string({ description: "Postgres port", required_error: "😱 You forgot to add a Postgres port" }),
    POSTGRES_USER: z.string({ description: "Postgres user", required_error: "😱 You forgot to add a Postgres user" }),
    POSTGRES_PASSWORD: z.string({
        description: "Postgres password",
        required_error: "😱 You forgot to add a Postgres password",
    }),
    POSTGRES_DB: z.string({
        description: "Postgres database",
        required_error: "😱 You forgot to add a Postgres database",
    }),
    PGADMIN_DEFAULT_EMAIL: z
        .string({
            description: "Default email for pgAdmin",
        })
        .email()
        .optional(),
    PGADMIN_DEFAULT_PASSWORD: z
        .string({
            description: "Default password for pgAdmin",
        })
        .optional(),
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

export const envSchema = schema.refine(
    (value) => value.NODE_ENV === "production" || (!!value.PGADMIN_DEFAULT_PASSWORD && !!value.PGADMIN_DEFAULT_EMAIL),
    {
        message: "PGADMIN_DEFAULT_PASSWORD and PGADMIN_DEFAULT_EMAIL are required in test and development",
        path: ["PGADMIN_DEFAULT_PASSWORD", "PGADMIN_DEFAULT_EMAIL"],
    },
);

type Env = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Env {}
    }
}
