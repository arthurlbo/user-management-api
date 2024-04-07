import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";

export const User = createParamDecorator((filter: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
        throw new NotFoundException("User not found in request. Try to use this decorator after AuthGuard.");
    }

    if (filter) {
        return user[filter];
    }

    return user;
});
