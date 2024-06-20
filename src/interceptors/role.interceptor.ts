import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";

import { Observable } from "rxjs";

import { Role } from "@/enums/role.enum";

@Injectable()
export class RoleInterceptor implements NestInterceptor {
    public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();

        const { body, route } = request;
        const { roleId } = body;

        const isAuthRoute = route.path.includes("auth");

        if (!roleId || !isAuthRoute) return next.handle();

        const isAdminRole = roleId === Role.Admin;

        if (isAdminRole) {
            throw new UnauthorizedException(`you can't create yourself as an admin.`);
        }

        return next.handle();
    }
}
