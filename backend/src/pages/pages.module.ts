import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { FirebaseService } from 'src/firebase/firebase.service'; // <-- importar!

@Module({
  controllers: [PagesController],
  providers: [PagesService, FirebaseService],
  exports: [PagesService],
})
export class PagesModule {}
