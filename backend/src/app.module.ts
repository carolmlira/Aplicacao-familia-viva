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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    MinistriesModule,
    ScheduleModule,
    PagesModule,
    FirebaseModule,
  ],
  controllers: [PagesController],
  providers: [FirebaseService],
})
export class AppModule {}