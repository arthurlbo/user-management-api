import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { UserService } from "@/user/user.service";
import { PrismaService } from "@/prisma/prisma.service";

import { userIdMock } from "@/test/__mocks__/user-id.mock";
import { userListMock } from "@/test/__mocks__/user-list.mock";
import { createUserMock } from "@/test/__mocks__/create-user.mock";
import { updateUserMock } from "@/test/__mocks__/update-user.mock";
import { prismaServiceMock } from "@/test/__mocks__/prisma-service.mock";
import { updatePartialUserMock } from "@/test/__mocks__/update-partial-user.mock";

describe("UserService", () => {
    let userService: UserService;
    let prismaService: PrismaService;

    const user = userListMock[0];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, prismaServiceMock],
        }).compile();

        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe("Definitions", () => {
        it("should define userService correctly", () => {
            expect(userService).toBeDefined();
        });
    });

    describe("Create", () => {
        it("should create a user", async () => {
            const result = await userService.create(createUserMock);

            expect(result).toEqual(user);
        });
    });

    describe("Read", () => {
        it("should return a list of users (findAll)", async () => {
            const result = await userService.findAll();

            expect(result).toEqual(userListMock);
        });

        it("should return a user (findOne)", async () => {
            const result = await userService.findOne(userIdMock);

            expect(result).toEqual(user);
        });
    });

    describe("Update", () => {
        it("should update a user completely when using the PUT method", async () => {
            const result = await userService.update(userIdMock, updateUserMock);

            expect(result).toEqual(user);
        });

        it("should update a user partially when using the PATCH method", async () => {
            const result = await userService.updatePartial(userIdMock, updatePartialUserMock);

            expect(result).toEqual(user);
        });
    });

    describe("Delete", () => {
        it("should delete a user", async () => {
            const result = await userService.delete(userIdMock);

            expect(result).toEqual(user);
        });
    });

    describe("EnsureUserExistsById", () => {
        it("should throw an error if the user does not exist", async () => {
            jest.spyOn(prismaService.user, "count").mockResolvedValueOnce(0);

            const nonexistentId = "1234";

            await expect(userService.findOne(nonexistentId)).rejects.toThrow(
                new NotFoundException(`User with id: ${nonexistentId} does not exist.`),
            );
        });
    });
});
