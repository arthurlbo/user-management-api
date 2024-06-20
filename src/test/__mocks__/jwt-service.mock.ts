import { JwtService } from "@nestjs/jwt";

import { jwtTokenMock } from "@/test/__mocks__/jwt-token.mock";
import { jwtPayloadMock } from "@/test/__mocks__/jwt-payload.mock";

export const jwtServiceMock = {
    provide: JwtService,
    useValue: {
        sign: jest.fn().mockReturnValue(jwtTokenMock),
        verify: jest.fn().mockReturnValue(jwtPayloadMock),
    },
};
