import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";

import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const initialTime = Date.now();

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle().pipe(
            tap(() => {
                console.log("Method:", request.method);
                console.log("URL:", request.url);
                console.log(`Execution time: ${Date.now() - initialTime}ms`);
                console.log("Status code:", response.statusCode);
            }),
        );
    }
}
