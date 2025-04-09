import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    level: string;
    active: boolean;
    photo?: string;
    phone?: string;
    whatsappOptIn?: boolean;
  }
  
  @Injectable()
  export class UsersService {
    private users: User[] = [];
  
    create(userDto: CreateUserDto): User {
      const newUser: User = {
        id: this.users.length + 1,
        name: userDto.name,
        email: userDto.email,
        password: userDto.password,
        level: userDto.level,
        active: userDto.active,        
        photo: userDto.photo,
        phone: userDto.phone,
        whatsappOptIn: userDto.whatsappOptIn,
      };
  
      this.users.push(newUser);
      return newUser;
    }
  
    findAll(): User[] {
      return this.users;
    }
  
    findOne(id: number): User | undefined {
      return this.users.find((user) => user.id === id);
    }
    
    findByEmail(email: string): User | undefined {
      return this.users.find((user) => user.email === email);
    }
  
    remove(id: number): { deleted: boolean } {
      this.users = this.users.filter((user) => user.id !== id);
      return { deleted: true };
    }
  }