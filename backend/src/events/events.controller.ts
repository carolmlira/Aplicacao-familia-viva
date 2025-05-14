import { Controller, Post, Body, Get, Param, Delete, Patch, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-events.dto/create-events.dto';
import { EventEntity } from './entities/event.entity/event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Criar evento
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  // Listar todos os eventos
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  // Buscar evento específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // Atualizar evento
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: Partial<CreateEventDto>) {
    return this.eventsService.update(id, updateEventDto); // Chama o serviço para atualizar
  }


  // Remover evento por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
