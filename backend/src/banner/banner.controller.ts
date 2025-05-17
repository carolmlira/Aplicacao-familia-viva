import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner/create-banner';
import { UpdateBannerDto } from './dto/update-banner/update-banner';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imagemLogo', maxCount: 1 },
      { name: 'imagemBanner', maxCount: 1 },
    ])
  )
  async create(
    @UploadedFiles()
     files: { imagemLogo?: Express.Multer.File; imagemBanner?: Express.Multer.File },
    @Body() body: CreateBannerDto,
  ) {
    return this.bannerService.create(
      {
        imagemLogo: files.imagemLogo?.[0],
        imagemBanner: files.imagemBanner?.[0],
      },
      body,
    );
  }

  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'imagemLogo', maxCount: 1 },
      { name: 'imagemBanner', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @UploadedFiles()
    files: {
      imagemLogo?: Express.Multer.File[];
      imagemBanner?: Express.Multer.File[];
    },
    @Body() body: UpdateBannerDto,
  ) {
    return this.bannerService.update(
      id,
      {
        imagemLogo: files.imagemLogo?.[0],
        imagemBanner: files.imagemBanner?.[0],
      },
      body,
    );
  }

  @Get()
  async findOne() {
    return this.bannerService.findOne();
  }
}
