import { FileService } from "@/file/file.service";

export const fileServiceMock = {
    provide: FileService,
    useValue: {
        upload: jest.fn().mockResolvedValueOnce({ fileUrl: "file-url" }),
    },
};
