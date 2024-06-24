import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";

import { AuthService } from "@/auth/auth.service";
import { userIdMock } from "@/testing/user-id.mock";
import { jwtTokenMock } from "@/testing/jwt-token.mock";
import { authLoginMock } from "@/testing/auth-login.mock";
import { updateUserMock } from "@/testing/update-user.mock";
import { jwtPayloadMock } from "@/testing/jwt-payload.mock";
import { jwtServiceMock } from "@/testing/jwt-service.mock";
import { userServiceMock } from "@/testing/user-service.mock";
import { authRegisterMock } from "@/testing/auth-register.mock";
import { mailerServiceMock } from "@/testing/mailer-service.mock";
import { jwtResetTokenMock } from "@/testing/jwt-reset-token.mock";
import { userEntityListMock } from "@/testing/user-entity-list.mock";
import { usersRepositoryMock } from "@/testing/users-repository-mock";

describe("AuthService", () => {
    let authService: AuthService;
    let jwtService: JwtService;

    const user = userEntityListMock[0];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, usersRepositoryMock, jwtServiceMock, userServiceMock, mailerServiceMock],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe("Definitions", () => {
        it("should define authService correctly", () => {
            expect(authService).toBeDefined();
        });
    });

    describe("JWT token", () => {
        it("should generate a JWT token (generateToken)", async () => {
            const result = await authService.login(authLoginMock);

            expect(result).toEqual({ token: jwtTokenMock });
        });

        it("should fail to generate a JWT token (generateToken)", async () => {
            jest.spyOn(jwtService, "sign").mockImplementationOnce(new Error("Error generating JWT token") as never);

            try {
                await authService.login(authLoginMock);
            } catch (error) {
                expect(error).toEqual(new Error("Error generating JWT token"));
            }
        });

        it("should verify a JWT token (verifyToken)", async () => {
            const result = await authService.verifyToken(jwtTokenMock);

            expect(result).toEqual(jwtPayloadMock);
        });
    });

    describe("Authentication", () => {
        describe("Register and Login", () => {
            it("should register a new user", async () => {
                const result = await authService.register(authRegisterMock);

                expect(result).toEqual({ token: jwtTokenMock });
            });

            it("should login a user", async () => {
                const result = await authService.login(authLoginMock);

                expect(result).toEqual({ token: jwtTokenMock });
            });
        });

        describe("Update", () => {
            it("should update a user completely when using the PUT method", async () => {
                const result = await authService.update(userIdMock, updateUserMock, user);

                expect(result).toEqual(userEntityListMock[0]);
            });

            it("should update a user partially when using the PATCH method", async () => {
                const result = await authService.updatePartial(userIdMock, updateUserMock, user);

                expect(result).toEqual(userEntityListMock[0]);
            });
        });

        describe("Password", () => {
            it("should send a password reset email (forgotPassword)", async () => {
                const result = await authService.forgotPassword({ email: user.email });

                expect(result).toEqual({ success: true });
            });

            it("should reset a user's password (resetPassword)", async () => {
                const result = await authService.resetPassword({ password: "newPassword", token: jwtResetTokenMock });

                expect(result).toEqual({ token: jwtTokenMock });
            });
        });

        describe("itIsUsersId", () => {
            it("should throw an error if it's not logged user's id", async () => {
                const fakeUser = { ...user, id: "invalid id" };

                await expect(authService.update(userIdMock, updateUserMock, fakeUser)).rejects.toThrow(
                    new UnauthorizedException(
                        "You are trying to update a user that is not yourself. Please, make sure you are updating your own user.",
                    ),
                );
            });
        });
    });
});
