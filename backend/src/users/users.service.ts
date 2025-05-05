import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private collection = firestore.collection('users');

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser: UserEntity = {
      id: uuidv4(),
      ...createUserDto,
    };
    await this.collection.doc(newUser.id).set(newUser);
    return newUser;
  }

  async findAll(): Promise<UserEntity[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data() as UserEntity);
  }

  async findOne(id: string): Promise<UserEntity> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return doc.data() as UserEntity;
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const snapshot = await this.collection.where('email', '==', email).get();
    if (snapshot.empty) return undefined;
    return snapshot.docs[0].data() as UserEntity;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    const updatedData = {
      ...doc.data(),
      ...updateUserDto,
    };
    await docRef.update(updatedData);
    return updatedData as UserEntity;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return { deleted: false };
    await this.collection.doc(id).delete();
    return { deleted: true };
  }
}
