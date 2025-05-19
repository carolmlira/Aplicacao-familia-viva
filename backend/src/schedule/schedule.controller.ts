import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC, Role.USER)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VOLUNT)
  findAll() {
    return this.scheduleService.findAll();
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
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC, Role.USER)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }

  @Get('/user/:userId')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC, Role.USER)
  findByUser(@Param('userId') userId: string) {
    return this.scheduleService.findByUser(userId);
  }

  @Get('/user/:userId/pending')
  @Roles(Role.ADMIN, Role.VOLUNT, Role.LIDER, Role.COMUNIC, Role.USER)
  findByUser2(@Param('userId') userId: string) {
    return this.scheduleService.findByUser2(userId);
  }

  @Get('/available/all')
  @Roles(Role.ADMIN, Role.VOLUNT)
  findAllAvailable() {
    return this.scheduleService.findAllAvailable();
  }

  @Get('/available/my-ministry')
  @Roles(Role.LIDER)
  findAvailableByMyMinistry(@Request() req) {
    const ministryId = req.user.ministryId;
    return this.scheduleService.findAvailableByMyMinistry(ministryId);
  }

  @Get('/confirmed/all')
  @Roles(Role.ADMIN, Role.VOLUNT)
  findAllConfirmed() {
    return this.scheduleService.findAllConfirmed();
  }

  @Get('/confirmed/my-ministry')
  @Roles(Role.LIDER)
  findConfirmedByMyMinistry(@Request() req) {
    const ministryId = req.user.ministryId;
    console.log('Ministério recebido no token:', ministryId);
    return this.scheduleService.findConfirmedByMinistry(ministryId);
  }
}
