import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';
import { v4 as uuidv4 } from 'uuid';
import { MinistryEntity } from './entities/ministry.entity/ministry.entity';

@Injectable()
export class MinistriesService {
  private ministries: MinistryEntity[] = []; // Temporário até integrar com Firebase

  // Criar um novo ministério
  create(createMinistriesDto: CreateMinistriesDto): MinistryEntity{
    const newMinistry = {
      id: uuidv4(),
      ...createMinistriesDto,
    };
    this.ministries.push(newMinistry);
    return newMinistry;
  }

  // Retornar todos os ministérios
  findAll() {
    return this.ministries;
  }

  // Retornar um ministério por ID
  findOne(id: string) {
    const ministry = this.ministries.find((m) => m.id === id);
    if (!ministry) {
      throw new NotFoundException('Ministério não encontrado');
    }
    return ministry;
  }

  // Atualizar ministério
  update(id: string, updateData: Partial<CreateMinistriesDto>) {
    const ministry = this.findOne(id);
    const updated = { ...ministry, ...updateData };
    const index = this.ministries.findIndex((m) => m.id === id);
    this.ministries[index] = updated;
    return updated;
  }

  // Remover ministério
  remove(id: string) {
    const index = this.ministries.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException('Ministério não encontrado');
    }
    this.ministries.splice(index, 1);
    return { message: 'Ministério removido com sucesso' };
  }
}
