import { Module } from '@nestjs/common';
import { FooterService } from './footer.service';
import { FooterController } from './footer.controller';

@Module({
  controllers: [FooterController],
  providers: [FooterService],
})
export class FooterModule {}
