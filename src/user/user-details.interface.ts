import { UserRole } from './user.entity';

export interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
}
