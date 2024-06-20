import { UserService } from "@/user/user.service";

import { userListMock } from "@/test/__mocks__/user-list.mock";

export const userServiceMock = {
    provide: UserService,
    useValue: {
        delete: jest.fn().mockReturnValue({ success: true }),
        findAll: jest.fn().mockReturnValue(userListMock),
        create: jest.fn().mockReturnValue(userListMock[0]),
        update: jest.fn().mockReturnValue(userListMock[0]),
        findOne: jest.fn().mockReturnValue(userListMock[0]),
        updatePartial: jest.fn().mockReturnValue(userListMock[0]),
    },
};
