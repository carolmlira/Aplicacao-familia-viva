import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UsersService {
  private collection = firestore.collection('users');

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const safeUserDto = createUserDto;

    const newUser: UserEntity = {
      id: uuidv4(),
      ...safeUserDto,
      password: hashedPassword,
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const userData = doc.data() as UserEntity;

    // Verifica se uma nova senha foi enviada
    if (updateUserDto.password) {
      // 🔥 Remova a exigência de senha antiga
      const newHash = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = newHash;
    }

    // Pode remover essa linha se não usar oldSenha mais
    const { oldSenha, ...dataToUpdate } = updateUserDto;

    const updatedData = {
      ...userData,
      ...dataToUpdate,
    };

    await docRef.update(updatedData);

    return updatedData as UserEntity;
  }

  async updateResetToken(id: string, token: string, expires: Date) {
    // Exemplo genérico para Firebase, Mongo, etc.
    return await this.collection.doc(id).update({
      resetToken: token,
      resetExpires: expires.toISOString(),
    });
  }

  async verifyResetToken(token: string): Promise<UserEntity | null> {
    const snapshot = await this.collection
      .where('resetToken', '==', token)
      .get();
    if (snapshot.empty) {
      return null;
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data() as UserEntity;

    // Verificar se o token ainda está válido
    if (!user.resetExpires) {
      return null; // resetExpires está ausente ou nulo
    }

    const expiresAt = new Date(user.resetExpires);
    if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
      return null; // Data inválida ou token expirado
    }

    return user;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return { deleted: false };
    await this.collection.doc(id).delete();
    return { deleted: true };
  }
}
