import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }
  
  @UseGuards(JwtAuthGuard)
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
  update(@Param('id') id: string, @Body() dto: CreateScheduleDto) {
    return this.scheduleService.update(id, dto);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
  
  @Get('/user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.scheduleService.findByUser(userId);
  }

  @Get('/user/:userId/pending')
  findByUser2(@Param('userId') userId: string) {
    return this.scheduleService.findByUser2(userId);
  }

  @Get('/available/all')
findAllAvailable() {
  return this.scheduleService.findAllAvailable();
}

@Get('/confirmed/all')
findAllConfirmed() {
  return this.scheduleService.findAllConfirmed();
}
}
