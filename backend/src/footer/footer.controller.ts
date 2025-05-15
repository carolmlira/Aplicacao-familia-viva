import { Controller, Get, Patch, Body, Post } from '@nestjs/common';
import { FooterService } from './footer.service';
import { UpdateFooter } from './dto/update-footer/update-footer';
import { CreateFooter } from './dto/create-footer/create-footer';

@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Get()
  async getFooter() {
    return await this.footerService.getFooter();
  }

  @Patch()
  async updateFooter(@Body() updateDto: UpdateFooter) {
    return await this.footerService.updateFooter(updateDto);
  }

  @Post()
  async createFooter(@Body() createDto: CreateFooter) {
    return await this.footerService.createFooter(createDto);
  }
}
