import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  
  
  @Controller('users')
  @UseGuards(JwtAuthGuard) // Protege a rota
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(Number(id));
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.usersService.remove(Number(id));
    }
  }
  