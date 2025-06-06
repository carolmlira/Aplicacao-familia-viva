"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../config/firebase.config");
const uuid_1 = require("uuid");
let ScheduleService = class ScheduleService {
    collection = firebase_config_1.firestore.collection('schedules');
    async create(createScheduleDto) {
        const { userId, date } = createScheduleDto;
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('date', '==', date)
            .get();
        if (!snapshot.empty) {
            throw new common_1.BadRequestException(`A data ${date} já foi marcada por você.`);
        }
        const id = (0, uuid_1.v4)();
        const newSchedule = { id, ...createScheduleDto };
        await this.collection.doc(id).set(newSchedule);
        return newSchedule;
    }
    async findAvailableByMinistry(userId) {
        const userDoc = await firebase_config_1.firestore.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return [];
        }
        const userData = userDoc.data();
        const ministry = userData?.ministry;
        if (!ministry) {
            return [];
        }
        const snapshot = await this.collection
            .where('confirmed', '==', false)
            .where('ministry', '==', ministry)
            .get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findConfirmedByMinistry(userId) {
        const userDoc = await firebase_config_1.firestore.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return [];
        }
        const userData = userDoc.data();
        const ministry = userData?.ministry;
        if (!ministry) {
            return [];
        }
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
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        return doc.exists ? doc.data() : null;
    }
    async update(id, updateDto) {
        const plainUpdate = JSON.parse(JSON.stringify(updateDto));
        await this.collection.doc(id).update(plainUpdate);
        const updatedDoc = await this.collection.doc(id).get();
        return updatedDoc.data();
    }
    async remove(id) {
        await this.collection.doc(id).delete();
        return { deleted: true };
    }
    async findByUser(userId) {
        const snapshot = await this.collection
            .where('userId', '==', userId)
            .where('confirmed', '==', true)
            .get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findByUser2(userId) {
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
    async findAvailableByMyMinistry(ministryId) {
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
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)()
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map