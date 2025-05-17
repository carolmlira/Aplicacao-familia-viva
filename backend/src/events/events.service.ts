import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventDto } from './dto/create-events.dto/create-events.dto';
import { EventEntity } from './entities/event.entity/event.entity';
import { firestore } from '../config/firebase.config';

@Injectable()
export class EventsService {
  private collection = firestore.collection('events');

  // Criar novo evento
  async create(event: CreateEventDto): Promise<EventEntity> {
    const newEvent: EventEntity = {
      id: uuidv4(),
      ...event,

    };
    await this.collection.doc(newEvent.id).set(newEvent);
    return newEvent;
  }

  // Listar todos os eventos
  async findAll(): Promise<EventEntity[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as EventEntity);
  }

  // Buscar evento por ID
  async findOne(id: string): Promise<EventEntity> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return doc.data() as EventEntity;
  }

  // Atualizar evento por ID
  async update(id: string, updateEventDto: Partial<CreateEventDto>): Promise<EventEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Atualiza o documento diretamente
    await docRef.update(updateEventDto); // Usa .update() para atualizar apenas os campos fornecidos

    // Retorna os dados atualizados
    const updatedDoc = await docRef.get(); // Pega o documento atualizado
    return updatedDoc.data() as EventEntity; // Retorna como EventEntity
  }
  

  // Deletar evento
  async remove(id: string): Promise<{ message: string; deleted: EventEntity }> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    const deleted = doc.data() as EventEntity;
    await docRef.delete();
    return { message: 'Evento removido com sucesso', deleted };
  }
}
