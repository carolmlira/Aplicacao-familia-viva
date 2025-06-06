// src/interceptors/file.interceptor.ts
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Limits } from 'busboy';
import * as Busboy from 'busboy';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { Readable } from 'stream';

type FileInterceptorOptions = {
  limits?: Limits;
};

@Injectable()
export class FileInterceptor implements NestInterceptor {
  constructor(
    private fieldName: string,
    private maxCount?: number,
    private options: FileInterceptorOptions = {},
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: request.headers,
        limits: this.options.limits ?? { fileSize: 1024 * 1024 * 10 },
      });

      const fields: { [x: string]: string } = {};
      const files: (Partial<Express.Multer.File> & { id?: string })[] = [];
      let count = 0;

      busboy.on('file', (name, file: Readable, info) => {
        const id = randomUUID();

        if (name !== this.fieldName) {
          file.resume();
          return;
        }

        if (typeof this.maxCount !== 'undefined' && count++ >= this.maxCount) {
          file.resume();
          throw new BadRequestException('Too many files...');
        }

        file.on('data', (data: Buffer) => {
          const existing = files.find((v) => v.id === id);
          if (existing) {
            existing.buffer = Buffer.concat([
              existing.buffer ?? Buffer.alloc(0),
              data,
            ]);
            existing.size = (existing.size || 0) + data.length;
          } else {
            files.push({
              id,
              fieldname: name,
              originalname: info.filename,
              encoding: info.encoding,
              mimetype: info.mimeType,
              size: data.length,
              buffer: data,
            });
          }
        });
      });

      busboy.on('field', (name, value) => {
        fields[name] = value;
      });

      busboy.on('finish', () => {
        request.body = fields;
        const data = files.map((file) => {
          delete file.id;
          return file;
        });

        if (this.maxCount === 1) request.file = data[0];
        else request.files = data;

        resolve(next.handle());
      });

      busboy.on('error', (err) => {
        reject(err);
      });

      if (request.rawBody) busboy.end(request.rawBody);
      else request.pipe(busboy);
    });
  }
}
