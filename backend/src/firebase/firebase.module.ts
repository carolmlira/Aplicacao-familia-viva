// src/firebase/firebase.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';
import * as multer from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(), // Salva na memória do firebase
    }),
  ],
  controllers: [FirebaseController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {
  static forRoot():
    | import('@nestjs/common').Type<any>
    | import('@nestjs/common').DynamicModule
    | Promise<import('@nestjs/common').DynamicModule>
    | import('@nestjs/common').ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
}
