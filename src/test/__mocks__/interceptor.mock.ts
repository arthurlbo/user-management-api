import { NestInterceptor } from "@nestjs/common";

export const interceptorMock: NestInterceptor = { intercept: jest.fn() };
