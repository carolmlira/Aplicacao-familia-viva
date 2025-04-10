import { Injectable } from '@nestjs/common';
import { firestore } from '../config/firebase.config';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScheduleService {
  private collection = firestore.collection('schedules');

  async create(createScheduleDto: CreateScheduleDto) {
    const id = uuidv4();
    const newSchedule = { id, ...createScheduleDto };
    await this.collection.doc(id).set(newSchedule);
    return newSchedule;
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async update(id: string, updateDto: Partial<CreateScheduleDto>) {
    await this.collection.doc(id).update(updateDto);
    const updatedDoc = await this.collection.doc(id).get();
    return updatedDoc.data();
  }

  async remove(id: string) {
    await this.collection.doc(id).delete();
    return { deleted: true };
  }
}
