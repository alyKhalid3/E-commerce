import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable, tap } from "rxjs";







@Injectable()
export class LoggerInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        

        return next
        .handle()
        .pipe(
            map((interceptorData) => {
                const {message='success',data={}} = interceptorData
                return {
                    message,
                    data,
                    
                }
            })
        );        
    }
}






