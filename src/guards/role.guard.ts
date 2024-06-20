import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { Role } from "@/enums/role.enum";
import { ROLES_KEY } from "@/decorators/roles.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    public async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const hasRole = requiredRoles.some((role) => role === user.role);

        if (!hasRole) {
            throw new ForbiddenException("You don't have permission to access this resource.");
        }

        return hasRole;
    }
}
