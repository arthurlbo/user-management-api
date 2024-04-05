import { BadRequestException, NestMiddleware } from "@nestjs/common";

import { NextFunction, Response, Request } from "express";

// The ParseUUIDPipe is a built-in pipe that validates the UUID format already, this is only for study purposes.

export class IdValidationMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const isInvalidId = !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);

        if (isInvalidId) {
            throw new BadRequestException("Invalid user id.");
        }

        next();
    }
}
