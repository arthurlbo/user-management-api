import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { AuthService } from "@/auth/auth.service";
import { UserService } from "@/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    public async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const { authorization } = request.headers;

        const token = (authorization ?? "").split(" ")[1];

        try {
            const tokenPayload = await this.authService.verifyToken(token);

            const user = await this.userService.findOne(tokenPayload.id);

            request.user = user;

            return true;
        } catch (error) {
            throw new ForbiddenException(error.message);
        }
    }
}
