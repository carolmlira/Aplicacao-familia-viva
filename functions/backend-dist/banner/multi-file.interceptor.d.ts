import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
type FileInterceptorFieldConfig = {
    name: string;
    maxCount?: number;
};
export declare class MultiFileInterceptor implements NestInterceptor {
    private fields;
    constructor(fields: FileInterceptorFieldConfig[]);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
export {};
