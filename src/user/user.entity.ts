import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPERADMIN = 'superadmin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: UserRole;
}
