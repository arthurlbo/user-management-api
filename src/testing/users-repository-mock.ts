import { getRepositoryToken } from "@nestjs/typeorm";

import { UserEntity } from "@/user/entity/user.entity";
import { userEntityListMock } from "@/testing/user-entity-list.mock";

export const usersRepositoryMock = {
    provide: getRepositoryToken(UserEntity),
    useValue: {
        exists: jest.fn().mockResolvedValue(true),
        delete: jest.fn().mockResolvedValue(true),
        find: jest.fn().mockReturnValue(userEntityListMock),
        save: jest.fn().mockResolvedValue(userEntityListMock[0]),
        create: jest.fn().mockResolvedValue(userEntityListMock[0]),
        update: jest.fn().mockResolvedValue(userEntityListMock[0]),
        findOneBy: jest.fn().mockResolvedValue(userEntityListMock[0]),
    },
};
