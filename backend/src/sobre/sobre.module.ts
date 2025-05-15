import { Module } from '@nestjs/common';
import { SobreService } from './sobre.service';
import { SobreController } from './sobre.controller'; // importe o controller
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [SobreService],
  controllers: [SobreController],  // <-- aqui você declara o controller
  exports: [SobreService], // se precisar usar o service fora também
})
export class SobreModule {}
