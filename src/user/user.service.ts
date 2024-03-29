import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SignupResponse } from 'src/auth/dto/signup-response';
import { SigninUserInput } from 'src/auth/dto/signin-user.input';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserInput } from 'src/auth/dto/signup-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async getUserByEmail(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ username }],
    });
    if (!user) {
      throw new NotFoundException('User n found');
    }
    return user;
  }
  async getUserByUsername(fullName: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ fullName }],
    });
    if (!user) {
      throw new NotFoundException('User nott found');
    }
    return user;
  }
  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ phoneNumber }],
    });
    if (!user) {
      throw new NotFoundException('User no found');
    }
    return user;
  }

  async createUser(createUserInput: SignupUserInput): Promise<SignupResponse> {
    const { username, password, phoneNumber, fullName } = createUserInput;
    const user = this.usersRepository.create({
      username,
      password,
      phoneNumber,
      fullName,
    });
    try {
      await this.usersRepository.save(user);
      const { username, fullName, phoneNumber, id } = user;
      return {
        id,
        phoneNumber,
        username,
        fullName,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUser(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [{ username }],
    });
    if (!user) {
      throw new NotFoundException(`Useer ${username} not found.`);
    }
    return user;
  }

  async updateUserProfile(updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.getUser(updateUserInput.id);
    const { username, fullName, phoneNumber } = updateUserInput;
    if (username) {
      user.username = username;
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
