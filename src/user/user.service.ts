import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    const response = await this.usersRepository.query('CALL get_all_users()');
    return response[0];
  }

  async getUserById(id: number): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_id(${id})`,
    );
    return response[0];
  }

  async getUserByEmail(email: string): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_email("${email}")`,
    );
    return response[0];
  }
}
