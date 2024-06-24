import { UserService } from "@/user/user.service";
import { userEntityListMock } from "@/testing/user-entity-list.mock";

export const userServiceMock = {
    provide: UserService,
    useValue: {
        delete: jest.fn().mockResolvedValue({ success: true }),
        findAll: jest.fn().mockResolvedValue(userEntityListMock),
        create: jest.fn().mockResolvedValue(userEntityListMock[0]),
        update: jest.fn().mockResolvedValue(userEntityListMock[0]),
        findOne: jest.fn().mockResolvedValue(userEntityListMock[0]),
        updatePartial: jest.fn().mockResolvedValue(userEntityListMock[0]),
    },
};
