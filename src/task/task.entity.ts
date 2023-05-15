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

  @Column({ default: '' })
  title: string;

  @Column()
  status: TaskStatus;

  @Column()
  manager: string;

  @Column({ type: 'timestamp', nullable: true })
  date_assigned?: Date;

  @Column({ type: 'timestamp', nullable: true })
  date_completed?: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
