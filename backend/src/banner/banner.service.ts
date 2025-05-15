import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateBannerDto } from './dto/create-banner/create-banner';
import { UpdateBannerDto } from './dto/update-banner/update-banner';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BannerService {
  private collection = firestore.collection('banner');

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(
    files: { imagemLogo: Express.Multer.File; imagemBanner: Express.Multer.File },
    dto: CreateBannerDto,
  ) {
    if (!files.imagemLogo || !files.imagemBanner) {
      throw new BadRequestException('Ambas as imagens são obrigatórias');
    }

    const logoFilename = `banner/${uuidv4()}-${files.imagemLogo.originalname}`;
    const bannerFilename = `banner/${uuidv4()}-${files.imagemBanner.originalname}`;

    const logoUrl = await this.firebaseService.uploadFile(files.imagemLogo, logoFilename);
    const bannerUrl = await this.firebaseService.uploadFile(files.imagemBanner, bannerFilename);

    const data = {
      frase: dto.frase,
      imagemLogo: logoUrl,
      imagemBanner: bannerUrl,
      createdAt: new Date(),
    };

    const docRef = await this.collection.add(data);
    return { id: docRef.id, ...data };
  }

  async findOne() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

async update(
  id: string,
  files: Partial<{ imagemLogo: Express.Multer.File; imagemBanner: Express.Multer.File }>,
  dto: UpdateBannerDto,
) {
  const docRef = this.collection.doc(id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new BadRequestException('Banner não encontrado');
  }

  const banner = docSnap.data();
  if (!banner) {
    throw new BadRequestException('Dados do banner não encontrados');
  }

  const updateData: any = {};

  // 🔁 Substituição da imagemLogo antiga se houver nova
  if (files.imagemLogo) {
    if (banner.imagemLogo) {
      await this.firebaseService.deleteFileByUrl(banner.imagemLogo);
    }

    const logoFilename = `banner/${uuidv4()}-${files.imagemLogo.originalname}`;
    updateData.imagemLogo = await this.firebaseService.uploadFile(files.imagemLogo, logoFilename);
  }

  // 🔁 Substituição da imagemBanner antiga se houver nova
  if (files.imagemBanner) {
    if (banner.imagemBanner) {
      await this.firebaseService.deleteFileByUrl(banner.imagemBanner);
    }

    const bannerFilename = `banner/${uuidv4()}-${files.imagemBanner.originalname}`;
    updateData.imagemBanner = await this.firebaseService.uploadFile(files.imagemBanner, bannerFilename);
  }

  // ✅ Atualização da frase (isso garante que ela será enviada corretamente)
  if (dto.frase !== undefined) {
    updateData.frase = dto.frase;
  }

  updateData.updatedAt = new Date();

  await docRef.update(updateData);
  return { id, ...banner, ...updateData };
}

  
}
