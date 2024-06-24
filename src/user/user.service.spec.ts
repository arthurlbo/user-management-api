import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { UserService } from "@/user/user.service";
import { userIdMock } from "@/testing/user-id.mock";
import { UserEntity } from "@/user/entity/user.entity";
import { createUserMock } from "@/testing/create-user.mock";
import { updateUserMock } from "@/testing/update-user.mock";
import { userEntityListMock } from "@/testing/user-entity-list.mock";
import { usersRepositoryMock } from "@/testing/users-repository-mock";
import { updatePartialUserMock } from "@/testing/update-partial-user.mock";

describe("UserService", () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    const user = userEntityListMock[0];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, usersRepositoryMock],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<UserEntity>>(usersRepositoryMock.provide);
    });

    describe("Definitions", () => {
        it("should define userService correctly", () => {
            expect(userService).toBeDefined();
        });

        it("should define userRepository correctly", () => {
            expect(userRepository).toBeDefined();
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

            expect(result).toEqual(userEntityListMock);
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

            expect(result).toEqual({ success: true });
        });
    });

    describe("EnsureUserExistsById", () => {
        it("should throw an error if the user does not exist", async () => {
            jest.spyOn(userRepository, "exists").mockResolvedValue(false);

            const nonexistentId = "1234";

            await expect(userService.findOne(nonexistentId)).rejects.toThrow(
                new NotFoundException(`User with id: ${nonexistentId} does not exist.`),
            );
        });
    });
});
