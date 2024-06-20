import { PrismaService } from "@/prisma/prisma.service";

import { userListMock } from "./user-list.mock";

export const prismaServiceMock = {
    provide: PrismaService,
    useValue: {
        user: {
            findMany: jest.fn().mockReturnValue(userListMock),
            findUnique: jest.fn().mockReturnValue(userListMock[0]),
            findFirst: jest.fn().mockReturnValue(userListMock[0]),
            create: jest.fn().mockReturnValue(userListMock[0]),
            update: jest.fn().mockReturnValue(userListMock[0]),
            delete: jest.fn().mockReturnValue(userListMock[0]),
            count: jest.fn().mockReturnValue(userListMock.length),
        },
    },
};
