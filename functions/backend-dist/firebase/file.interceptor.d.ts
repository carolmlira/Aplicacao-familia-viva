import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Limits } from 'busboy';
import { Observable } from 'rxjs';
type FileInterceptorOptions = {
    limits?: Limits;
};
export declare class FileInterceptor implements NestInterceptor {
    private fieldName;
    private maxCount?;
    private options;
    constructor(fieldName: string, maxCount?: number | undefined, options?: FileInterceptorOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>>;
}
export {};
