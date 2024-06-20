import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable } from "rxjs";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class EmailInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) {}

    public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const { body, route, user } = request;

        const { email } = body;

        if (!email) return next.handle();

        const emailExists = (await this.prisma.user.count({ where: { email } })) > 0;

        const isUserEmail = user?.email === email;
        const isAuthRoute = route.path.includes("auth");

        if (emailExists && (!isUserEmail || !isAuthRoute)) {
            throw new ConflictException(`${email} already have been taken.`);
        }

        return next.handle();
    }
}
