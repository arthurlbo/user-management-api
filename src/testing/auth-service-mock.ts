import { AuthService } from "@/auth/auth.service";

import { jwtTokenMock } from "@/testing/jwt-token.mock";
import { jwtPayloadMock } from "@/testing/jwt-payload.mock";
import { userEntityListMock } from "@/testing/user-entity-list.mock";

export const authServiceMock = {
    provide: AuthService,
    useValue: {
        verifyToken: jest.fn().mockResolvedValue(jwtPayloadMock),
        register: jest.fn().mockResolvedValue({ token: jwtTokenMock }),
        login: jest.fn().mockResolvedValue({ token: jwtTokenMock }),
        update: jest.fn().mockResolvedValue(userEntityListMock[0]),
        updatePartial: jest.fn().mockResolvedValue(userEntityListMock[0]),
        forgotPassword: jest.fn().mockResolvedValue({ success: true }),
        resetPassword: jest.fn().mockResolvedValue({ token: jwtTokenMock }),
    },
};
