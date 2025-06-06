import { BadRequestException, Injectable } from '@nestjs/common';
import { firestore } from '../config/firebase.config';
import { CreateScheduleDto } from './dto/create-schedule.dto/create-schedule.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ScheduleService {
  private collection = firestore.collection('schedules');

  async create(createScheduleDto: CreateScheduleDto) {
    const { userId, date } = createScheduleDto;

    // Verificar se já existe uma disponibilidade para o mesmo usuário e data
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('date', '==', date)
      .get();

    if (!snapshot.empty) {
      // Lançar exceção amigável e com status 400
      throw new BadRequestException(`A data ${date} já foi marcada por você.`);
    }

    const id = uuidv4();
    const newSchedule = { id, ...createScheduleDto };
    await this.collection.doc(id).set(newSchedule);
    return newSchedule;
  }

  async findAvailableByMinistry(userId: string) {
    const userDoc = await firestore.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return [];
    }

    const userData = userDoc.data();
    const ministry = userData?.ministry;

    if (!ministry) {
      return [];
    }

    // Buscar escalas disponíveis (confirmed == false) para o ministério
    const snapshot = await this.collection
      .where('confirmed', '==', false)
      .where('ministry', '==', ministry)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findConfirmedByMinistry(userId: string) {
    // Busca o usuário para pegar o ministério
    const userDoc = await firestore.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return []; // ou lance erro se preferir
    }

    const userData = userDoc.data();
    const ministry = userData?.ministry;

    if (!ministry) {
      return []; // usuário não tem ministério definido
    }

    // Busca as escalas confirmadas para esse ministério
    const snapshot = await this.collection
      .where('confirmed', '==', true)
      .where('ministry', '==', ministry)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async update(id: string, updateDto: Partial<CreateScheduleDto>) {
    const plainUpdate = JSON.parse(JSON.stringify(updateDto));

    await this.collection.doc(id).update(plainUpdate);
    const updatedDoc = await this.collection.doc(id).get();
    return updatedDoc.data();
  }

  async remove(id: string) {
    await this.collection.doc(id).delete();
    return { deleted: true };
  }

  async findByUser(userId: string) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('confirmed', '==', true)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findByUser2(userId: string) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('confirmed', '==', false)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findAllAvailable() {
    const snapshot = await this.collection
      .where('confirmed', '==', false)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findAvailableByMyMinistry(ministryId: String) {
    const snapshot = await this.collection
      .where('confirmed', '==', false)
      .where('ministryId', '==', ministryId)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }

  async findAllConfirmed() {
    const snapshot = await this.collection.where('confirmed', '==', true).get();

    return snapshot.docs.map((doc) => doc.data());
  }
}
