import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.LIDER)
  findAll() {
    return this.scheduleService.findAll();
  }

  @Roles(Role.ADMIN, Role.LIDER)
  @Get('confirmed/my-ministry')
  async findConfirmedByMinistry(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Usuário não autenticado ou inválido');
    }
    const userId = req.user.userId;

    return this.scheduleService.findConfirmedByMinistry(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/available/my-ministry')
  async findAvailableByMyMinistry(@Req() req) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException('Usuário não autenticado ou inválido');
    }
    const userId = req.user.userId;
    // Exemplo: chamar serviço que retorna as agendas disponíveis do ministério do usuário
    return this.scheduleService.findAvailableByMinistry(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER)
  update(@Param('id') id: string, @Body() dto: CreateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }

  @Get('/user/:userId')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC)
  findByUser(@Param('userId') userId: string) {
    return this.scheduleService.findByUser(userId);
  }

  @Get('/user/:userId/pending')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC)
  findByUser2(@Param('userId') userId: string) {
    return this.scheduleService.findByUser2(userId);
  }

  @Get('/available/all')
  @Roles(Role.ADMIN, Role.VOLUNT)
  findAllAvailable() {
    return this.scheduleService.findAllAvailable();
  }

  @Get('/confirmed/all')
  @Roles(Role.ADMIN, Role.VOLUNT)
  findAllConfirmed() {
    return this.scheduleService.findAllConfirmed();
  }
}
