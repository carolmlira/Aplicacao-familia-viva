import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventDto } from './dto/create-events.dto/create-events.dto';
import { EventEntity } from './entities/event.entity/event.entity';

@Injectable()
export class EventsService {
  private events: EventEntity[] = [];

  // Criar novo evento
  create(event: CreateEventDto): EventEntity {
    const newEvent: EventEntity = {
      id: uuidv4(),
      ...event,
      createdAt: new Date(),
    };
    this.events.push(newEvent);
    return newEvent;
  }

  // Listar todos os eventos
  findAll(): EventEntity[] {
    return this.events;
  }

  // Buscar evento por ID
  findOne(id: string): EventEntity {
    const event = this.events.find(e => e.id === id);
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return event;
  }

  // Atualizar evento por ID
  update(id: string, updateEventDto: Partial<CreateEventDto>): EventEntity {
    const eventIndex = this.events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    const existingEvent = this.events[eventIndex];
    const updatedEvent = {
      ...existingEvent,
      ...updateEventDto,
    };

    this.events[eventIndex] = updatedEvent;
    return updatedEvent;
  }

  // Deletar evento
  remove(id: string): { message: string; deleted: EventEntity } {
    const index = this.events.findIndex(e => e.id === id);
    if (index === -1) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    const [deleted] = this.events.splice(index, 1);
    return { message: 'Evento removido com sucesso', deleted };
  }
}
