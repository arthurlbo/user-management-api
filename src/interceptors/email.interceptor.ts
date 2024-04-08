import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { Observable } from "rxjs";

import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class EmailInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const { user } = request;
        const { email } = request.body;

        const emailExists = (await this.prisma.user.count({ where: { email } })) > 0;

        const isUserEmail = user?.email === email;

        if (emailExists && !isUserEmail) {
            throw new ConflictException(`${email} already have been taken.`);
        }

        return next.handle();
    }
}
