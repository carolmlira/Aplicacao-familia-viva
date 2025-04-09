import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  private schedules: any[] = []; // substituir por Firebase depois

  create(dto: CreateScheduleDto) {
    const newSchedule = { id: this.schedules.length + 1,
     ...dto };
    this.schedules.push(newSchedule);
    return newSchedule;
  }

  findAll() {
    return this.schedules;
  }

  findOne(id: string) {
    return this.schedules.find((s) => s.id === id);
  }

  update(id: string, dto: CreateScheduleDto) {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index > -1) {
      this.schedules[index] = { ...this.schedules[index], ...dto };
      return this.schedules[index];
    }
    return null;
  }
}
