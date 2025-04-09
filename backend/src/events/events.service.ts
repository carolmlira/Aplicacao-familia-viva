import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-events.dto/create-events.dto';

@Injectable()
export class EventsService {
  private events: CreateEventDto[] = [];

  // Criar novo evento
  create(event: CreateEventDto) {
    const newEvent = {
      ...event,
      id: this.events.length + 1, // simula um ID
      createdAt: new Date(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  // Listar todos os eventos
  findAll() {
    return this.events;
  }

  // Buscar evento por ID (opcional)
  findOne(id: number) {
    const event = this.events.find(e => e['id'] === id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return event;
  }

  // Deletar evento (opcional)
  remove(id: number) {
    const index = this.events.findIndex(e => e['id'] === id);
    if (index === -1) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    const deleted = this.events.splice(index, 1);
    return { message: 'Evento removido com sucesso', deleted };
  }
}
