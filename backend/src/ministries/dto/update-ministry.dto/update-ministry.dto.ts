import { PartialType } from "@nestjs/mapped-types";
import { CreateMinistriesDto } from "../create-ministry.dto/create-ministry.dto";

export class UpdateMinistryDto extends PartialType(CreateMinistriesDto) {}