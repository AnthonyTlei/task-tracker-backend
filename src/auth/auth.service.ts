import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ExistingUserDTO } from 'src/user/dto/existing-user.dto';
import { NewUserDTO } from 'src/user/dto/new-user.dto';
import { UserDetails } from 'src/user/user-details.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async _verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const users = await this.userService._getUserByEmail(email);
    const user = users[0];
    const doesUserExist = !!user;
    if (!doesUserExist) return null;
    const doesPasswordMatch = await this._verifyPassword(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    return this.userService._convertUserToUserDetails(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);
    if (!user)
      throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  async register(user: Readonly<NewUserDTO>): Promise<UserDetails | any> {
    const { first_name, last_name, email, password } = user;
    const existingUsers = await this.userService._getUserByEmail(email);
    const existingUser = existingUsers[0];
    if (existingUser)
      throw new HttpException(
        'An account with that email alredy exists',
        HttpStatus.CONFLICT,
      );
    const hashedPassword = await this.hashPassword(password);
    await this.userService._create(
      first_name,
      last_name,
      email,
      hashedPassword,
    );
    const users = await this.userService._getUserByEmail(email);
    const newUser = users[0];
    return this.userService._convertUserToUserDetails(newUser);
  }

  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt);
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }
}
