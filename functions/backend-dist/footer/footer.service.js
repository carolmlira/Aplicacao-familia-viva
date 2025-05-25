"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../config/firebase.config");
let FooterService = class FooterService {
    collection = firebase_config_1.firestore.collection('footer');
    docId = 'footer-info';
    async getFooter() {
        const doc = await this.collection.doc(this.docId).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    }
    async updateFooter(data) {
        await this.collection.doc(this.docId).set({ ...data }, { merge: true });
        const updated = await this.collection.doc(this.docId).get();
        return { id: updated.id, ...updated.data() };
    }
    async createFooter(data) {
        await this.collection.doc(this.docId).set({ ...data });
        return { id: this.docId, ...data };
    }
};
exports.FooterService = FooterService;
exports.FooterService = FooterService = __decorate([
    (0, common_1.Injectable)()
], FooterService);
//# sourceMappingURL=footer.service.js.map