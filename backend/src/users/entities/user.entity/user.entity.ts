import { Role } from 'src/auth/role.enum';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  level: Role;
  active: boolean;
  photo?: string;
  photoURL?: string;
  phone?: string;
  whatsappOptIn: boolean;
  ministryId: string;
  resetToken?: string | null; // Token de reset
  resetExpires?: string | null;
}
