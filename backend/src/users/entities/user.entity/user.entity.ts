import { Role } from 'src/auth/role.enum';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  level: Role;
  active: boolean;
  photoURL?: string;
  phone?: string;
  ministryId: string;
  resetToken?: string | null; // Token de reset
  resetExpires?: string | null;
}
