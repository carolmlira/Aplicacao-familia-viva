// src/events/dto/update-events.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from '../create-events.dto/create-events.dto';

export class UpdateEventsDto extends PartialType(CreateEventDto){}