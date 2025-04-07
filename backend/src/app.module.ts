import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from './schedule/schedule.module';
import { EventsController } from './events/events.controller';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [UsersModule, ScheduleModule, EventsModule],
  controllers: [AppController, AuthController, UsersController, ScheduleController, EventsController],
  providers: [AppService, UsersService, ScheduleService, EventsService],
})
export class AppModule {}
