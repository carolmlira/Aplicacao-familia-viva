import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { MinistriesController } from './ministries/ministries.controller';
import { MinistriesModule } from './ministries/ministries.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local', //  aqui você especifica o caminho
      isGlobal: true, // permite usar em todos os módulos sem reimportar
    }),
    UsersModule,
    AuthModule,
    EventsModule,
    MinistriesModule,
    FirebaseModule,
  ],
  controllers: [MinistriesController],
  providers: [FirebaseService],
})
export class AppModule {}

