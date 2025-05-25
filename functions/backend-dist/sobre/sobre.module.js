"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SobreModule = void 0;
const common_1 = require("@nestjs/common");
const sobre_service_1 = require("./sobre.service");
const sobre_controller_1 = require("./sobre.controller");
const firebase_module_1 = require("../firebase/firebase.module");
let SobreModule = class SobreModule {
};
exports.SobreModule = SobreModule;
exports.SobreModule = SobreModule = __decorate([
    (0, common_1.Module)({
        imports: [firebase_module_1.FirebaseModule],
        providers: [sobre_service_1.SobreService],
        controllers: [sobre_controller_1.SobreController],
        exports: [sobre_service_1.SobreService],
    })
], SobreModule);
//# sourceMappingURL=sobre.module.js.map