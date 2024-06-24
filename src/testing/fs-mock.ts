/* eslint-disable @typescript-eslint/no-unused-vars */

export const fsMock = {
    existsSync: jest.fn((_path: string) => true),
    unlinkSync: jest.fn((_path: string) => undefined),
};
