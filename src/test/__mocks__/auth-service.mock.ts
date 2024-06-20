import { AuthService } from "@/auth/auth.service";

import { jwtTokenMock } from "@/test/__mocks__/jwt-token.mock";
import { userListMock } from "@/test/__mocks__/user-list.mock";
import { jwtPayloadMock } from "@/test/__mocks__/jwt-payload.mock";

export const authServiceMock = {
    provide: AuthService,
    useValue: {
        verifyToken: jest.fn().mockReturnValue(jwtPayloadMock),
        register: jest.fn().mockReturnValue({ token: jwtTokenMock }),
        login: jest.fn().mockReturnValue({ token: jwtTokenMock }),
        update: jest.fn().mockReturnValue(userListMock[0]),
        updatePartial: jest.fn().mockReturnValue(userListMock[0]),
        forgotPassword: jest.fn().mockReturnValue({ success: true }),
        resetPassword: jest.fn().mockReturnValue({ token: jwtTokenMock }),
    },
};
