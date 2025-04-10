// src/firebase/firebase.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Firestore
  @Post('document/:collection')
  async createDocument(
    @Param('collection') collection: string,
    @Body() data: any,
  ) {
    return this.firebaseService.createFirestoreDoc(collection, data);
  }

  // Realtime
  @Post('realtime/:path')
  async createRealtime(
    @Param('path') path: string,
    @Body() data: any,
  ) {
    return this.firebaseService.createRealtimeData(path, data);
  }
}
