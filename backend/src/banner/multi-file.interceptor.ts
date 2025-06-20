// src/firebase/multi-file.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadRequestException,
} from '@nestjs/common';
import * as Busboy from 'busboy';
import { Observable } from 'rxjs';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';

type FileInterceptorFieldConfig = {
  name: string;
  maxCount?: number;
};

@Injectable()
export class MultiFileInterceptor implements NestInterceptor {
  constructor(private fields: FileInterceptorFieldConfig[]) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    return new Promise((resolve, reject) => {
      const busboy = Busboy({
        headers: request.headers,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      });

      const fieldCounts: Record<string, number> = {};
      const files: Record<string, Express.Multer.File[]> = {};
      const fields: Record<string, string> = {};

      busboy.on('file', (fieldname, file: Readable, info) => {
        const fieldConfig = this.fields.find((f) => f.name === fieldname);
        if (!fieldConfig) {
          file.resume();
          return;
        }

        fieldCounts[fieldname] = (fieldCounts[fieldname] || 0) + 1;
        if (
          fieldConfig.maxCount &&
          fieldCounts[fieldname] > fieldConfig.maxCount
        ) {
          file.resume();
          throw new BadRequestException(
            `Too many files for field ${fieldname}`,
          );
        }

        const fileData: Partial<Express.Multer.File> = {
          fieldname,
          originalname: info.filename,
          encoding: info.encoding,
          mimetype: info.mimeType,
          buffer: Buffer.alloc(0),
          size: 0,
        };

        file.on('data', (data: Buffer) => {
          fileData.buffer = Buffer.concat([fileData.buffer!, data]);
          fileData.size = (fileData.size || 0) + data.length;
        });

        file.on('end', () => {
          files[fieldname] = files[fieldname] || [];
          files[fieldname].push(fileData as Express.Multer.File);
        });
      });

      busboy.on('field', (name, value) => {
        fields[name] = value;
      });

      busboy.on('finish', () => {
        request.body = fields;
        request.files = files;
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
