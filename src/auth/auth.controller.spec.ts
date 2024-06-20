import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "@/auth/auth.controller";

import { AuthGuard } from "@/guards/auth.guard";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { fileMock } from "@/test/__mocks__/file.mock";
import { guardMock } from "@/test/__mocks__/guard.mock";
import { userIdMock } from "@/test/__mocks__/user-id.mock";
import { userListMock } from "@/test/__mocks__/user-list.mock";
import { jwtTokenMock } from "@/test/__mocks__/jwt-token.mock";
import { authLoginMock } from "@/test/__mocks__/auth-login.mock";
import { updateUserMock } from "@/test/__mocks__/update-user.mock";
import { interceptorMock } from "@/test/__mocks__/interceptor.mock";
import { authServiceMock } from "@/test/__mocks__/auth-service.mock";
import { fileServiceMock } from "@/test/__mocks__/file-service.mock";
import { authRegisterMock } from "@/test/__mocks__/auth-register.mock";
import { jwtResetTokenMock } from "@/test/__mocks__/jwt-reset-token.mock";

describe("AuthController", () => {
    let authController: AuthController;

    const reflector = new Reflector();
    const user = userListMock[0];

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

            expect(result).toEqual(userListMock[0]);
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

            expect(result).toEqual(userListMock[0]);
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
            const req = { protocol: "http", hostname: "localhost" } as any;

            const result = await authController.uploadAvatar(user, req, fileMock);

            expect(result).toEqual({ fileUrl: "file-url" });
        });

        it("should apply the guards", () => {
            const guards = reflector.get("__guards__", authController.uploadAvatar);

            expect(guards.length).toBe(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });
    });
});