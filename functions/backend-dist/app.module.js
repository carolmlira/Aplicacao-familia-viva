"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const events_module_1 = require("./events/events.module");
const ministries_module_1 = require("./ministries/ministries.module");
const schedule_module_1 = require("./schedule/schedule.module");
const pages_controller_1 = require("./pages/pages.controller");
const pages_module_1 = require("./pages/pages.module");
const firebase_service_1 = require("./firebase/firebase.service");
const firebase_module_1 = require("./firebase/firebase.module");
const firebase_controller_1 = require("./firebase/firebase.controller");
const email_module_1 = require("./email/email.module");
const sobre_module_1 = require("./sobre/sobre.module");
const footer_controller_1 = require("./footer/footer.controller");
const footer_service_1 = require("./footer/footer.service");
const footer_module_1 = require("./footer/footer.module");
const banner_service_1 = require("./banner/banner.service");
const banner_controller_1 = require("./banner/banner.controller");
const banner_module_1 = require("./banner/banner.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env.local',
                isGlobal: true,
            }),
            firebase_module_1.FirebaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            events_module_1.EventsModule,
            ministries_module_1.MinistriesModule,
            schedule_module_1.ScheduleModule,
            pages_module_1.PagesModule,
            email_module_1.EmailModule,
            sobre_module_1.SobreModule,
            footer_module_1.FooterModule,
            banner_module_1.BannerModule
        ],
        controllers: [pages_controller_1.PagesController, firebase_controller_1.FirebaseController, footer_controller_1.FooterController, banner_controller_1.BannerController,],
        providers: [firebase_service_1.FirebaseService, footer_service_1.FooterService, banner_service_1.BannerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map