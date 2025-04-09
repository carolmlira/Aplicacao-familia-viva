import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  create(createUserDto: CreateUserDto): UserEntity {
    const newUser: UserEntity = {
      id: uuidv4(),
      ...createUserDto,
    };

    this.users.push(newUser);
    return newUser;
  }

  findAll(): UserEntity[] {
    return this.users;
  }

  findOne(id: string): UserEntity | undefined {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email: string): UserEntity | undefined {
    return this.users.find((user) => user.email === email);
  }

  update(id: string, updateUserDto: Partial<CreateUserDto>): UserEntity {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...updateUserDto,
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  remove(id: string): { deleted: boolean } {
    const originalLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== id);
    return { deleted: this.users.length < originalLength };
  }
}
