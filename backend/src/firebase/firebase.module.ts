import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // opcional, só se quiser salvar local também
    }),
  ],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}

