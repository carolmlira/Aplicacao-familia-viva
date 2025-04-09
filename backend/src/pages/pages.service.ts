// src/pages/pages.service.ts
import { Injectable } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto/create-page.dto'
import { UpdatePageDto } from './dto/create-page.dto/update-page.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PagesService {
  private pages: any[] = [];

  create(createPageDto: CreatePageDto) {
    const newPage = {
      id: uuidv4(),
      ...createPageDto,
    };
    this.pages.push(newPage);
    return newPage;
  }

  findAll() {
    return this.pages;
  }

  findOne(id: string) {
    return this.pages.find((page) => page.id === id);
  }

  update(id: string, updatePageDto: UpdatePageDto) {
    const index = this.pages.findIndex((page) => page.id === id);
    if (index === -1) return null;

    this.pages[index] = { ...this.pages[index], ...updatePageDto };
    return this.pages[index];
  }

  remove(id: string) {
    const index = this.pages.findIndex((page) => page.id === id);
    if (index === -1) return null;

    const deleted = this.pages.splice(index, 1);
    return deleted[0];
  }
}
