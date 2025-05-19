import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { UserEntity } from './entities/user.entity/user.entity';
import { Role } from 'src/auth/role.enum';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.COMUNIC, Role.LIDER, Role.USER, Role.VOLUNT)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.COMUNIC, Role.LIDER, Role.USER, Role.VOLUNT)
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<UserEntity> {
    const dto = plainToInstance(UpdateUserDto, body);
    const errors = await validate(dto, { skipMissingProperties: true });

    if (errors.length > 0) {
      const messages = errors.flatMap((err) =>
        Object.values(err.constraints ?? {}),
      );
      throw new BadRequestException(messages);
    }

    return this.usersService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
