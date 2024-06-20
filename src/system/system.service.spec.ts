import { Test, TestingModule } from "@nestjs/testing";

import { SystemService } from "@/system/system.service";

import { fsMock } from "@/test/__mocks__/fs.mock";
import { fileMock } from "@/test/__mocks__/file.mock";

describe("SystemService", () => {
    let systemService: SystemService;

    beforeEach(async () => {
        jest.resetAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [SystemService],
        }).compile();

        systemService = module.get<SystemService>(SystemService);
    });

    describe("Definitions", () => {
        it("should define systemService correctly", () => {
            expect(systemService).toBeDefined();
        });
    });

    describe("deleteExistingFile", () => {
        const { existsSync, unlinkSync } = fsMock;

        const path = "avatar.png";
        const fileExtensions = ["png"];

        it("should delete the file if it exists", () => {
            systemService.deleteExistingFile(path, fileExtensions);

            existsSync(path);
            unlinkSync(path);

            expect(existsSync).toHaveBeenCalledWith(path);
            expect(unlinkSync).toHaveBeenCalledWith(path);
        });

        it("should not delete the file if it does not exist", async () => {
            systemService.deleteExistingFile(path, fileExtensions);

            existsSync(path);

            expect(existsSync).toHaveBeenCalledWith(path);

            jest.spyOn(fsMock, "existsSync").mockReturnValueOnce(false);

            if (existsSync(path) === true) {
                unlinkSync(path);
            }

            expect(unlinkSync).not.toHaveBeenCalled();
        });
    });

    describe("createFile", () => {
        const path = "src/test/__mocks__/avatar.mock.jpg";

        it("should create a new file", async () => {
            await expect(systemService.createFile(path, fileMock)).resolves.toBeUndefined();
        });

        it("should throw an error if the file creation fails", async () => {
            await expect(systemService.createFile(path, {} as Express.Multer.File))
                .rejects.toThrow()
                .catch((error) => {
                    expect(error).toBeInstanceOf(Error);
                });
        });
    });
});