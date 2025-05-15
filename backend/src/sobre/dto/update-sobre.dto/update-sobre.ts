import { PartialType } from '@nestjs/mapped-types';
import { CreateSobre} from '../create-sobre.dto/create-sobre';

export class UpdateSobre extends PartialType(CreateSobre) {}
