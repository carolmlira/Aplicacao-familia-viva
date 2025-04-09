import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';

@Injectable()
export class MinistriesService {
  private ministries: any[] = []; // Temporário até integrar com Firebase

  // Criar um novo ministério
  create(createMinistriesDto: CreateMinistriesDto) {
    const newMinistry = {
      id: this.ministries.length + 1,
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
  findOne(id: number) {
    const ministry = this.ministries.find((m) => m.id === id);
    if (!ministry) {
      throw new NotFoundException('Ministério não encontrado');
    }
    return ministry;
  }

  // Atualizar ministério
  update(id: number, updateData: Partial<CreateMinistriesDto>) {
    const ministry = this.findOne(id);
    const updated = { ...ministry, ...updateData };
    const index = this.ministries.findIndex((m) => m.id === id);
    this.ministries[index] = updated;
    return updated;
  }

  // Remover ministério
  remove(id: number) {
    const index = this.ministries.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new NotFoundException('Ministério não encontrado');
    }
    this.ministries.splice(index, 1);
    return { message: 'Ministério removido com sucesso' };
  }
}
