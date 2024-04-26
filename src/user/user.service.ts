import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SignupResponse } from 'src/auth/dto/signup-response';

import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserInput } from 'src/auth/dto/signup-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  async createUser(createUserInput: SignupUserInput): Promise<SignupResponse> {
    const { username, password, phoneNumber, fullName } = createUserInput;
    const user = this.usersRepository.create({
      username,
      password,
      phoneNumber,
      fullName,
      roles: 'user',
    });
    try {
      await this.usersRepository.save(user);
      const { username, fullName, phoneNumber, id, roles } = user;
      return {
        roles,
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
  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['products', 'categories', 'orders'],
    });
    if (!user) {
      throw new NotFoundException(`Useer ${id} not found.`);
    }
    return user;
  }
  async getAllUsers(): Promise<User[]> {
    const users = await this.usersRepository.find();
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }
  async deleteUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    try {
      await this.usersRepository.remove(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user.');
    }
  }

  async getUserByEmail(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },

      relations: ['products', 'categories', 'orders'],
    });
    if (!user) {
      throw new NotFoundException('User n found');
    }
    return user;
  }
  async getUserByFullName(fullName: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { fullName },
      relations: ['products', 'categories', 'orders'],
    });
    if (!user) {
      throw new NotFoundException('User nott found');
    }
    return user;
  }
  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { phoneNumber },
      relations: ['products', 'categories', 'orders'],
    });
    if (!user) {
      throw new NotFoundException('User no found');
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
