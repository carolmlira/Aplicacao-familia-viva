import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MinistriesModule } from './ministries/ministries.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PagesController } from './pages/pages.controller';
import { PagesModule } from './pages/pages.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseController } from './firebase/firebase.controller';
import { EmailModule } from './email/email.module';
import { SobreModule } from './sobre/sobre.module';
import { FooterController } from './footer/footer.controller';
import { FooterService } from './footer/footer.service';
import { FooterModule } from './footer/footer.module';
import { BannerService } from './banner/banner.service';
import { BannerController } from './banner/banner.controller';
import { BannerModule } from './banner/banner.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    FirebaseModule,
    UsersModule,
    AuthModule,
    EventsModule,
    MinistriesModule,
    ScheduleModule,
    PagesModule,
    EmailModule,
    SobreModule,
    FooterModule,
    BannerModule

  ],
  controllers: [PagesController, FirebaseController, FooterController, BannerController,],
  providers: [FirebaseService, FooterService, BannerService],
})
export class AppModule {}