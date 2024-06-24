import { unlinkSync } from "node:fs";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import * as request from "supertest";
import { User } from "@prisma/client";

import { Role } from "@/common/enums/role.enum";
import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";

import { updateUserMock } from "./__mocks__/update-user.mock";
import { authRegisterMock } from "./__mocks__/auth-register.mock";

describe("AuthController", () => {
    let app: INestApplication;

    let accessToken: string;
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
    });

    it("should not register a new user with the same email", async () => {
        const response = await request(app.getHttpServer()).post("/auth/register").send(authRegisterMock);

        expect(response.status).toBe(409);
    });

    it("should not register a new user trying to register as admin", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/register")
            .send({ ...authRegisterMock, roleId: Role.Admin });

        expect(response.status).toBe(401);
    });

    it("should login a user", async () => {
        const response = await request(app.getHttpServer()).post("/auth/login").send(authRegisterMock);

        const { token } = response.body;

        expect(response.status).toBe(201);
        expect(typeof token).toBe("string");

        accessToken = token;
    });

    it("should get the user data", async () => {
        const response = await request(app.getHttpServer())
            .get("/auth/me")
            .set("Authorization", `Bearer ${accessToken}`);

        const { body, status } = response;

        expect(status).toBe(200);
        expect(body.roleId).toBe(Role.User);
        expect(body).not.toHaveProperty("password");

        loggedUser = body;
    });

    it("should not get the user data without a token", async () => {
        const response = await request(app.getHttpServer()).get("/auth/me");

        expect(response.status).toBe(403);
    });

    it("should not get the user data with an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .get("/auth/me")
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should upload an avatar photo", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/avatar")
            .set("Authorization", `Bearer ${accessToken}`)
            .attach("file", "src/test/__mocks__/avatar.mock.jpg");

        expect(response.status).toBe(201);

        unlinkSync(response.body.fileUrl);
    });

    it("should not upload an avatar photo with an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/avatar")
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not upload an avatar photo with an invalid file", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/avatar")
            .set("Authorization", `Bearer ${accessToken}`)
            .attach("file", "README.md");

        expect(response.status).toBe(400);
    });

    it("should update a user when using the PUT method", async () => {
        const response = await request(app.getHttpServer())
            .put(`/auth/${loggedUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updateUserMock);

        expect(response.status).toBe(200);
    });

    it("should not update a user, using the PUT method, with an invalid token ", async () => {
        const response = await request(app.getHttpServer())
            .put(`/auth/${loggedUser.id}`)
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not update a user, using the PUT method, with an invalid id", async () => {
        const response = await request(app.getHttpServer())
            .put("/auth/invalid-id")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    });

    it("should update a user partially when using the PATCH method", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/auth/${loggedUser.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ email: updateUserMock.email });

        expect(response.status).toBe(200);
    });

    it("should not update a user, using the PATCH method, with an invalid token", async () => {
        const response = await request(app.getHttpServer())
            .patch(`/auth/${loggedUser.id}`)
            .set("Authorization", "Bearer invalid-token");

        expect(response.status).toBe(403);
    });

    it("should not update a user, using the PATCH method, with an invalid id", async () => {
        const response = await request(app.getHttpServer())
            .patch("/auth/invalid-id")
            .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(400);
    });

    it("should send an email when the user forgets the password", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/forgot-password")
            .send({ email: updateUserMock.email });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
    });

    it("should not send an email when the user forgets the password and enters an invalid email", async () => {
        const response = await request(app.getHttpServer())
            .post("/auth/forgot-password")
            .send({ email: "invalid-email" });

        expect(response.status).toBe(401);
    });
});
