import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDetails } from './user-details.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /* These Methods should not be directly called by controllers. */
  _convertUserToDetails(user: User): UserDetails {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
  }

  async _getUsers(): Promise<User[]> {
    const response = await this.usersRepository.query('CALL get_all_users()');
    return response[0];
  }

  async _getUserById(id: number): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_id(${id})`,
    );
    return response[0];
  }

  async _getUserByEmail(email: string): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_email("${email}")`,
    );
    return response[0];
  }

  async _create(
    first_name: string,
    last_name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const response = await this.usersRepository.query(
      `CALL create_user("${first_name}", "${last_name}", "${email}", "${hashedPassword}")`,
    );
    return response[0];
  }

  /* These Methods can be directly called by controllers. */
  async getUsersDetails(): Promise<UserDetails[]> {
    const response = await this.usersRepository.query('CALL get_all_users()');
    return response;
  }

  async getUserDetailsByEmail(email: string): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_email("${email}")`,
    );
    return response[0];
  }

  async getUserDetailsById(id: number): Promise<User[]> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_id(${id})`,
    );
    return response[0];
  }
}
