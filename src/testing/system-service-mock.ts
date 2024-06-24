import { SystemService } from "@/system/system.service";

export const systemServiceMock = {
    provide: SystemService,
    useValue: {
        deleteExistingFile: jest.fn(),
        createFile: jest.fn(),
    },
};
