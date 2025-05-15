import { PartialType } from '@nestjs/mapped-types';
import { CreateBannerDto } from '../create-banner/create-banner';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
