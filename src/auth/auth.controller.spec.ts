import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "@/auth/auth.controller";

import { AuthGuard } from "@/guards/auth.guard";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { guardMock } from "@/testing/guard-mock";
import { userIdMock } from "@/testing/user-id.mock";
import { jwtTokenMock } from "@/testing/jwt-token.mock";
import { authLoginMock } from "@/testing/auth-login.mock";
import { updateUserMock } from "@/testing/update-user.mock";
import { interceptorMock } from "@/testing/interceptor-mock";
import { authServiceMock } from "@/testing/auth-service-mock";
import { fileServiceMock } from "@/testing/file-service-mock";
import { authRegisterMock } from "@/testing/auth-register.mock";
import { jwtResetTokenMock } from "@/testing/jwt-reset-token.mock";
import { userEntityListMock } from "@/testing/user-entity-list.mock";
import { getFile } from "@/testing/get-file";

describe("AuthController", () => {
    let authController: AuthController;

    const reflector = new Reflector();
    const user = userEntityListMock[0];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .overrideInterceptor(EmailInterceptor)
            .useValue(interceptorMock)
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    describe("Definitions", () => {
        it("should define authController correctly", () => {
            expect(authController).toBeDefined();
        });
    });

    describe("Register", () => {
        it("should register a new user", async () => {
            const result = await authController.register(authRegisterMock);

            expect(result).toEqual({ token: jwtTokenMock });
        });

        it("should apply the interceptors", () => {
            const interceptors = reflector.get("__interceptors__", authController.register);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);
        });
    });

    describe("Login", () => {
        it("should login a user", async () => {
            const result = await authController.login(authLoginMock);

            expect(result).toEqual({ token: jwtTokenMock });
        });
    });

    describe("Me", () => {
        it("should return the user's information", async () => {
            const result = await authController.me(user);

            delete user["password"];

            expect(result).toEqual(user);
        });

        it("should apply the guards", () => {
            const guards = reflector.get("__guards__", authController.me);

            expect(guards.length).toBe(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });
    });

    describe("Update", () => {
        it("should update a user completely when using the PUT method", async () => {
            const result = await authController.update(userIdMock, updateUserMock, user);

            expect(result).toEqual(userEntityListMock[0]);
        });

        it("should apply the interceptors and guards in PUT method", () => {
            const interceptors = reflector.get("__interceptors__", authController.update);
            const guards = reflector.get("__guards__", authController.update);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);

            expect(guards.length).toBe(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });

        it("should update a user partially when using the PATCH method", async () => {
            const result = await authController.updatePartial(userIdMock, updateUserMock, user);

            expect(result).toEqual(userEntityListMock[0]);
        });

        it("should apply the interceptors and guards in PATCH method", () => {
            const interceptors = reflector.get("__interceptors__", authController.updatePartial);
            const guards = reflector.get("__guards__", authController.updatePartial);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);

            expect(guards.length).toBe(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });
    });

    describe("Password", () => {
        it("should send a password reset email (forgotPassword)", async () => {
            const result = await authController.forgotPassword({ email: user.email });

            expect(result).toEqual({ success: true });
        });

        it("should reset a user's password (resetPassword)", async () => {
            const result = await authController.resetPassword({
                password: "newPassword",
                token: jwtResetTokenMock,
            });

            expect(result).toEqual({ token: jwtTokenMock });
        });
    });

    describe("uploadAvatar", () => {
        it("should upload an avatar", async () => {
            const file = await getFile();
            const req = { protocol: "http", hostname: "localhost" } as any;

            const result = await authController.uploadAvatar(user, req, file);

            expect(result).toEqual({ fileUrl: "file-url" });
        });

        it("should apply the guards", () => {
            const guards = reflector.get("__guards__", authController.uploadAvatar);

            expect(guards.length).toBe(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });
    });
});
