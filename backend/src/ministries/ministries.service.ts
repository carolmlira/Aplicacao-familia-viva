import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMinistriesDto } from './dto/create-ministry.dto/create-ministry.dto';
import { MinistryEntity } from './entities/ministry.entity/ministry.entity';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinistriesService {
  private collection = firestore.collection('ministries');

  async create(createMinistriesDto: CreateMinistriesDto): Promise<MinistryEntity> {
    const newMinistry = {
      id: uuidv4(),
      ...createMinistriesDto,
    };
    await this.collection.doc(newMinistry.id).set(newMinistry);
    return newMinistry;
  }

  async findAll(): Promise<MinistryEntity[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as MinistryEntity);
  }

  async findOne(id: string): Promise<MinistryEntity> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Ministério não encontrado');
    }
    return doc.data() as MinistryEntity;
  }

  async update(id: string, updateData: Partial<CreateMinistriesDto>): Promise<MinistryEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException('Ministério não encontrado');
    }
    const updated = { ...doc.data(), ...updateData };
    await docRef.set(updated);
    return updated as MinistryEntity;
  }

  async remove(id: string): Promise<{ message: string }> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Ministério não encontrado');
    }
    await this.collection.doc(id).delete();
    return { message: 'Ministério removido com sucesso' };
  }
}