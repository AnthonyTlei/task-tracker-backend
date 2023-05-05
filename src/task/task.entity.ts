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
  UNKNOWN = 'unknown',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  full_id: string;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  user_id: number;

  @Column()
  title: string;

  @Column()
  status: TaskStatus;

  @Column()
  manager: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
