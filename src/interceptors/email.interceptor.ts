import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CallHandler, ConflictException, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";

import { UserEntity } from "@/user/entity/user.entity";

@Injectable()
export class EmailInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const { body, route, user } = request;

        const { email } = body;

        if (!email) return next.handle();

        const emailExists = await this.usersRepository.exists({ where: { email } });

        const isUserEmail = user?.email === email;
        const isAuthRoute = route.path.includes("auth");

        if (emailExists && (!isUserEmail || !isAuthRoute)) {
            throw new ConflictException(`${email} already have been taken.`);
        }

        return next.handle();
    }
}
