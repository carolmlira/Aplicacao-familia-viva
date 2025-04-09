import { Module } from '@nestjs/common';
import { MinistriesService } from './ministries.service';
import { MinistriesController } from './ministries.controller';

@Module({
  controllers: [MinistriesController],
  providers: [MinistriesService],
  exports: [MinistriesService], // Exporta o service se precisar usar em outros módulos
})
export class MinistriesModule {}

