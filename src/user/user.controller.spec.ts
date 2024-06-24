import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { UserController } from "@/user/user.controller";

import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { EmailInterceptor } from "@/interceptors/email.interceptor";

import { guardMock } from "@/testing/guard-mock";
import { userIdMock } from "@/testing/user-id.mock";
import { createUserMock } from "@/testing/create-user.mock";
import { updateUserMock } from "@/testing/update-user.mock";
import { interceptorMock } from "@/testing/interceptor-mock";
import { userServiceMock } from "@/testing/user-service.mock";
import { userEntityListMock } from "@/testing/user-entity-list.mock";
import { updatePartialUserMock } from "@/testing/update-partial-user.mock";

describe("UserController", () => {
    let userController: UserController;

    const reflector = new Reflector();
    const user = userEntityListMock[0];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [userServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .overrideGuard(RoleGuard)
            .useValue(guardMock)
            .overrideInterceptor(EmailInterceptor)
            .useValue(interceptorMock)
            .compile();

        userController = module.get<UserController>(UserController);
    });

    describe("Definitions", () => {
        it("should define userController correctly", () => {
            expect(userController).toBeDefined();
        });
    });

    describe("Guards", () => {
        const guards = reflector.get("__guards__", UserController);

        it("should guards be applied", () => {
            expect(guards.length).toBe(2);
        });

        it("should apply the guards in the correct order", () => {
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
            expect(new guards[1]()).toBeInstanceOf(RoleGuard);
        });
    });

    describe("Create", () => {
        it("should create a user", async () => {
            const result = await userController.create(createUserMock);

            expect(result).toEqual(user);
        });

        it("should apply the interceptors", () => {
            const interceptors = reflector.get("__interceptors__", userController.create);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);
        });
    });

    describe("Read", () => {
        it("should return a list of users (findAll)", async () => {
            const result = await userController.findAll();

            expect(result).toEqual(userEntityListMock);
        });

        it("should return a user (findOne)", async () => {
            const result = await userController.findOne(userIdMock);

            expect(result).toEqual(user);
        });
    });

    describe("Update", () => {
        it("should update a user completely when using the PUT method", async () => {
            const result = await userController.update(userIdMock, updateUserMock);

            expect(result).toEqual(user);
        });

        it("should apply the interceptors in PUT method", () => {
            const interceptors = reflector.get("__interceptors__", userController.update);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);
        });

        it("should update a user partially when using the PATCH method", async () => {
            const result = await userController.updatePartial(userIdMock, updatePartialUserMock);

            expect(result).toEqual(user);
        });

        it("should apply the interceptors in PATCH method", () => {
            const interceptors = reflector.get("__interceptors__", userController.updatePartial);

            expect(interceptors.length).toBe(1);
            expect(new interceptors[0]()).toBeInstanceOf(EmailInterceptor);
        });
    });

    describe("Delete", () => {
        it("should delete a user", async () => {
            const result = await userController.delete(userIdMock);

            expect(result).toEqual({ success: true });
        });
    });
});
