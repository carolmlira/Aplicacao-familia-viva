"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const firebase_config_1 = require("../config/firebase.config");
let EventsService = class EventsService {
    collection = firebase_config_1.firestore.collection('events');
    async create(event) {
        const newEvent = {
            id: (0, uuid_1.v4)(),
            ...event,
        };
        await this.collection.doc(newEvent.id).set(newEvent);
        return newEvent;
    }
    async findAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Evento com ID ${id} não encontrado`);
        }
        return doc.data();
    }
    async update(id, updateEventDto) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Evento com ID ${id} não encontrado`);
        }
        await docRef.update(updateEventDto);
        const updatedDoc = await docRef.get();
        return updatedDoc.data();
    }
    async remove(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Evento com ID ${id} não encontrado`);
        }
        const deleted = doc.data();
        await docRef.delete();
        return { message: 'Evento removido com sucesso', deleted };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)()
], EventsService);
//# sourceMappingURL=events.service.js.map