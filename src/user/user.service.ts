import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
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
    const users = await this.usersRepository.find();
    return users;
  }

  async _getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async _getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }

  async _create(
    first_name: string,
    last_name: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    const newUser = this.usersRepository.create({
      first_name,
      last_name,
      password: hashedPassword,
      email,
      role: UserRole.USER,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  /* These Methods can be directly called by controllers. */
  async getUsersDetails(): Promise<UserDetails[]> {
    const users = await this.usersRepository.find();
    const usersDetails = this._convertUsersToUsersDetails(users);
    return usersDetails;
  }

  async getUserDetailsByEmail(email: string): Promise<UserDetails | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    const userDetails = this._convertUserToUserDetails(user);
    return userDetails;
  }

  async getUserDetailsById(id: number): Promise<UserDetails | null> {
    const user = await this.usersRepository.findOne({ where: { id } });
    const userDetails = this._convertUserToUserDetails(user);
    return userDetails;
  }

  async getUserTasks(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    return user.tasks;
  }
}
