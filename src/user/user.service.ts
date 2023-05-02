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
  _convertUserToUserDetails(user: User): UserDetails {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
  }

  _convertUsersToUsersDetails(users: User[]): UserDetails[] {
    const trimmedUsers: UserDetails[] = [];
    for (const user of users) {
      trimmedUsers.push(this._convertUserToUserDetails(user));
    }
    return trimmedUsers;
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
  async getUsersDetails(): Promise<UserDetails[] | null> {
    const response = await this.usersRepository.query('CALL get_all_users()');
    if (response[0].length == 0) return null;
    const users = this._convertUsersToUsersDetails(response[0]);
    return users;
  }

  async getUserDetailsByEmail(email: string): Promise<UserDetails | null> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_email("${email}")`,
    );
    if (response[0].length == 0) return null;
    const user = this._convertUserToUserDetails(response[0][0]);
    return user;
  }

  async getUserDetailsById(id: number): Promise<UserDetails | null> {
    const response = await this.usersRepository.query(
      `CALL get_user_by_id(${id})`,
    );
    if (response[0].length == 0) return null;
    const user = this._convertUserToUserDetails(response[0][0]);
    return user;
  }

  // async createUser(): Promise<User> {
  //   // Create a new user object
  //   const newUser = this.usersRepository.create({
  //     first_name: 'test',
  //     last_name: 'test',
  //     password: 'test',
  //     email: 'test',
  //     role: 'user',
  //   });

  //   // Save the new user to the database
  //   await this.usersRepository.save(newUser);

  //   return newUser;
  // }

  // async getUsers(): Promise<User[] | null> {
  //   try {
  //     const response = await this.usersRepository.find();
  //     console.log(response);
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     return null;
  //   }
  // }
}
