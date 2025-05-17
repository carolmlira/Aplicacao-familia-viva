import { PartialType } from '@nestjs/mapped-types';
import { CreateFooter} from '../create-footer/create-footer';

export class UpdateFooter extends PartialType(CreateFooter) {}
