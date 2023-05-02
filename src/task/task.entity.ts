import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export enum TaskStatus {
  BACKLOG = 'backlog',
  PROGRESS = 'progress',
  VALIDATING = 'validating',
  DONE = 'done',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_id: string;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  user_id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: ['backlog', 'progress', 'validating', 'done', 'paused', 'cancelled'],
    default: 'backlog',
  })
  status: string;

  @Column()
  manager: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
