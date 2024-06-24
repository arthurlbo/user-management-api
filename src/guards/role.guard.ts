import { Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

import { User as UserType } from "@prisma/client";

import { Role } from "@/common/enums/role.enum";
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

        const { user }: { user: UserType } = context.switchToHttp().getRequest();

        const hasRole = requiredRoles.some((role) => role === user.roleId);

        if (!hasRole) {
            throw new ForbiddenException("You don't have permission to access this resource.");
        }

        return hasRole;
    }
}
