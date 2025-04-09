import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { MinistriesService } from './ministries.service';
  import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';
  
  @Controller('ministries')
  export class MinistriesController {
    constructor(private readonly ministriesService: MinistriesService) {}
  
    @Post()
    create(@Body() createMinistriesDto: CreateMinistriesDto) {
      return this.ministriesService.create(createMinistriesDto);
    }
  
    @Get()
    findAll() {
      return this.ministriesService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.ministriesService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateMinistryDto: Partial<CreateMinistriesDto>,
    ) {
      return this.ministriesService.update(id, updateMinistryDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.ministriesService.remove(id);
    }
  }
  
