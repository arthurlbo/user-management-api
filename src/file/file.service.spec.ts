import { Test, TestingModule } from "@nestjs/testing";

import { FileService } from "@/file/file.service";

import { fileMock } from "@/test/__mocks__/file.mock";
import { systemServiceMock } from "@/test/__mocks__/system-service.mock";

describe("FileService", () => {
    let fileService: FileService;

    beforeEach(async () => {
        jest.resetAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [FileService, systemServiceMock],
        }).compile();

        fileService = module.get<FileService>(FileService);
    });

    describe("Definitions", () => {
        it("should define fileService correctly", () => {
            expect(fileService).toBeDefined();
        });
    });

    describe("upload", () => {
        const req = { protocol: "http", hostname: "localhost" } as any;

        it("should upload a file", async () => {
            const path = "src/test/__mocks__/avatar.mock.jpg";

            const result = await fileService.upload(req, fileMock, path);

            expect(result).toEqual({ fileUrl: "http://localhost/src/test/__mocks__/avatar.mock.jpg" });
        });

        it("should throw an error", async () => {
            const path = "";

            try {
                await fileService.upload(req, fileMock, path);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });
});
