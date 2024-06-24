import { JwtService } from "@nestjs/jwt";

import { jwtTokenMock } from "@/testing/jwt-token.mock";
import { jwtPayloadMock } from "@/testing/jwt-payload.mock";

export const jwtServiceMock = {
    provide: JwtService,
    useValue: {
        sign: jest.fn().mockReturnValue(jwtTokenMock),
        verify: jest.fn().mockReturnValue(jwtPayloadMock),
    },
};
