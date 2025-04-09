import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { v4 as uuidv4 } from 'uuid';
import { ScheduleEntity } from './entities/schedule.entity/schedule.entity';

@Injectable()
export class ScheduleService {
  private schedules: ScheduleEntity[] = [];

  create(createScheduleDto: CreateScheduleDto): ScheduleEntity {
    const newSchedule: ScheduleEntity = {
      id: uuidv4(),
      ...createScheduleDto,
    };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  findAll(): ScheduleEntity[] {
    return this.schedules;
  }

  findOne(id: string): ScheduleEntity {
    const schedule = this.schedules.find((s) => s.id === id);
    if (!schedule) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }
    return schedule;
  }

  update(id: string, dto: Partial<CreateScheduleDto>): ScheduleEntity {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    const updated = {
      ...this.schedules[index],
      ...dto,
    };

    this.schedules[index] = updated;
    return updated;
  }

  remove(id: string): { message: string } {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    this.schedules.splice(index, 1);
    return { message: 'Agendamento removido com sucesso' };
  }
}
