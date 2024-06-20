import { userIdMock } from "@/test/__mocks__/user-id.mock";

export const jwtPayloadMock = {
    id: userIdMock,
    iat: 1714003895,
    exp: 1716595895,
    aud: "users",
    iss: "Authentication",
    sub: userIdMock,
};
