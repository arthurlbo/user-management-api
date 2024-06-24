import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import * as request from "supertest";
import { User } from "@prisma/client";

import { Role } from "@/common/enums/role.enum";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";

import { updateUserMock } from "./__mocks__/update-user.mock";
import { authRegisterMock } from "./__mocks__/auth-register.mock";

describe("UserController", () => {
    let app: INestApplication;

    let accessToken: string;

    let newUser: User;
    let loggedUser: User;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(() => {
        app.close();
    });

    afterAll(async () => {
        const prismaService = new PrismaService();

        await prismaService.user.deleteMany();
    });

    it("should register a new user", async () => {
        const response = await request(app.getHttpServer()).post("/auth/register").send(authRegisterMock);

        expect(response.status).toBe(201);
        expect(typeof response.body.token).toBe("string");

        accessToken = response.body.token;
    });

    it("should get the logged user information", async () => {
        const response = await request(app.getHttpServer())
            .get("/auth/me")
            .set("Authorization", `Bearer ${accessToken}`);

        const { body, status } = response;

        expect(status).toBe(200);
        expect(body.roleId).toBe(Role.User);

        loggedUser = body;
    });

    it("should not allow a user with role !== admin have access in the /users routes", async () => {
        const create = request(app.getHttpServer()).post("/users").send();
        const findAll = request(app.getHttpServer()).get("/users").send();
        const findOne = request(app.getHttpServer()).get("/users/user_id").send();
        const update = request(app.getHttpServer()).put("/users/user_id").send();
        const updatePartial = request(app.getHttpServer()).patch("/users/user_id").send();
        const deleteUser = request(app.getHttpServer()).delete("/users/user_id").send();

        return Promise.all([create, findAll, findOne, update, updatePartial, deleteUser]).then((responses) => {
            responses.forEach((response) => {
                expect(response.status).toBe(403);
            });
        });
    });

    it("should manually set the user to admin", async () => {
        const prismaService = new PrismaService();

        // Update the user's role
        const updatedUser = await prismaService.user.update({
            where: { id: loggedUser.id },
            data: { roleId: Role.Admin },
        });

        expect(updatedUser.roleId).toEqual(Role.Admin);
    });

    it("should create a new user", async () => {
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ ...authRegisterMock, email: "fake_email@email.com" });

        newUser = response.body;

        expect(response.status).toBe(201);
    });

    it("should not create a new user with the same email", async () => {
        const response = await request(app.getHttpServer())
            .post("/users")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(newUser);

        expect(response.status).toBe(409);
    });

    it("should get all users", async () => {
        const response = await request(app.getHttpServer()).get("/users").set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should get a user by id", async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(newUser.id);
    });

    it("should update a user using the PUT method", async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updateUserMock);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe("marvin@email.com");
    });

    it("should not update a user, using the PUT method, with the same email", async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updateUserMock);

        expect(response.status).toBe(409);
    });

    it("should not update a user, using the PUT method, with an invalid token ", async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${newUser.id}`)
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not update a user, using the PUT method, with an invalid id", async () => {
        const response = await request(app.getHttpServer())
            .put("/users/invalid-id")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    });

    it("should update a user partially using the PATCH method", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ email: "new@email.com" });

        expect(response.status).toBe(200);
        expect(response.body.email).toBe("new@email.com");
    });

    it("should not update a user, using the PATCH method, with the same email", async () => {
        const response = await request(app.getHttpServer())
            .put(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ email: "new@email.com" });

        expect(response.status).toBe(409);
    });

    it("should not update a user, using the PATCH method, with an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/users/${newUser.id}`)
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not update a user, using the PATCH method, with an invalid id", async () => {
        const response = await request(app.getHttpServer())
            .patch("/users/invalid-id")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    });

    it("should delete a user", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${newUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
    });

    it("should not delete a user with an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${newUser.id}`)
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not delete a user with an invalid id", async () => {
        const response = await request(app.getHttpServer())
            .delete("/users/invalid-id")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    });
});
