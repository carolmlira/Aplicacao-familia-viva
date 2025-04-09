export interface UserEntity {
    id: string;
    name: string;
    email: string;
    password: string;
    level: string;
    active: boolean;
    photo?: string;
    phone?: string;
    whatsappOptIn: boolean;
  }
  