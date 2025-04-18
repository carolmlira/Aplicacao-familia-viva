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
})
export class FirebaseModule {}
