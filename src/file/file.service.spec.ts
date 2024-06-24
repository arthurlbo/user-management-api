import { Test, TestingModule } from "@nestjs/testing";

import { getFile } from "@/testing/get-file";
import { FileService } from "@/file/file.service";
import { systemServiceMock } from "@/testing/system-service-mock";

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
            const path = "src/testing/avatar.mock.jpg";

            const file = await getFile();

            const result = await fileService.upload(req, file, path);

            expect(result).toEqual({ fileUrl: "http://localhost/src/testing/avatar.mock.jpg" });
        });

        it("should throw an error", async () => {
            const path = "";

            const file = await getFile();

            try {
                await fileService.upload(req, file, path);
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });
});
