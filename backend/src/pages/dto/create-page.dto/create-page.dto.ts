export class CreatePageDto {
    title: string;
    content: string;
    slug?: string;
    icon?: string;
    active: boolean;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
