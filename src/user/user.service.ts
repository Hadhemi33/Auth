import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import { SignupResponse } from 'src/auth/dto/signup-response';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { SignupUserInput } from 'src/auth/dto/signup-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { NotificationService } from 'src/notification/notification.service';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';
import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private notificationService: NotificationService,
    @InjectRepository(SpecialProductPrice)
    private specialProductPriceRepository: Repository<SpecialProductPrice>,
  ) {}
  async updateUser(
    id: string,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserInput);
    return this.usersRepository.save(user);
  }
  async findOne(conditions: any): Promise<User> {
    return this.usersRepository.findOne(conditions);
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  private async generateVerificationCode(user: User): Promise<string> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiryDate = new Date(Date.now() + 3600 * 1000); // 1 hour expiry
    user.resetPasswordToken = verificationCode;
    user.resetPasswordTokenExpiry = expiryDate;
    await this.save(user);
    return verificationCode;
  }
  async requestPasswordReset(username: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = expiryDate;
    await this.usersRepository.save(user);

    await this.sendPasswordResetEmail(username, resetToken);
    return true;
  }
  async verifyResetCode(username: string, code: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username, resetPasswordToken: code },
    });
    if (!user || user.resetPasswordTokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }
    return true;
  }
  async sendPasswordResetEmail(
    username: string,
    verificationCode: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport({
      // host: 'live.smtp.mailtrap.io',
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'hadhemi.benmansour@isimg.tn',
        // user: 'api',
        // pass: '80f2fd075c3505c43d6286246169d6fa',
        pass: 'aY3rFTjRkbGACPUf',
      },
    });

    const mailOptions = {
      from: 'Contact@BidFlick.com',
      to: username,
      subject: 'Verification Code for Password Reset',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
  }
  async resetPassword(
    username: string,
    code: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { username, resetPasswordToken: code },
    });
    if (!user || user.resetPasswordTokenExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }

    user.password = await this.hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await this.usersRepository.save(user);
    return true;
  }
  async sendNotification(
    userId: string,
    message: string,
    specialProductPriceId?: string,
  ): Promise<void> {
    try {
      console.log(`Sending notification to user ${userId}: ${message}`);

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      const specialProductPrice =
        await this.specialProductPriceRepository.findOne({
          where: { id: specialProductPriceId },
        });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found.`);
      }

      if (specialProductPriceId) {
        if (!specialProductPrice) {
          throw new NotFoundException(
            `Special product price with ID ${specialProductPriceId} not found.`,
          );
        }
      }

      await this.notificationService.create({
        message,
        user,
        specialProductPrice,
      });
    } catch (error) {
      console.error(
        `Error sending notification to user ${userId}: ${error.message}`,
      );
      throw new InternalServerErrorException('Failed to send notification.');
    }
  }
  async createUser(createUserInput: SignupUserInput): Promise<SignupResponse> {
    const { username, password, phoneNumber, fullName, imageUrl } =
      createUserInput;
    const user = this.usersRepository.create({
      username,
      password,
      phoneNumber,
      fullName,
      imageUrl,
      roles: 'user',
    });
    try {
      await this.usersRepository.save(user);
      const { username, fullName, phoneNumber, id, roles, imageUrl } = user;
      return {
        roles,
        imageUrl,
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
      throw new NotFoundException('Sorry but User not found');
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

  // async updateUserProfile(
  //   updateUserInput: UpdateUserInput,
  //   user: User,
  // ): Promise<User> {
  //   const found = await this.getUser(user.id);
  //   const { username, fullName, phoneNumber, imageUrl } = updateUserInput;
  //   if (username) {
  //     found.username = username;
  //   }
  //   if (fullName) {
  //     found.fullName = fullName;
  //   }
  //   if (phoneNumber) {
  //     found.phoneNumber = phoneNumber;
  //   }
  //   if (imageUrl) {
  //     found.imageUrl = imageUrl;
  //   }
  //   try {
  //     await this.usersRepository.save(found);
  //     return found;
  //   } catch (error) {
  //     throw new InternalServerErrorException();
  //   }
  // }
  async updateUserProfile(
    updateUserInput: UpdateUserInput,
    user: User,
  ): Promise<User> {
    if (!updateUserInput || !user) {
      throw new BadRequestException('Invalid input or user');
    }

    const found = await this.getUser(user.id);

    const { username, fullName, phoneNumber, imageUrl, address } =
      updateUserInput;

    if (username) {
      found.username = username.trim();
    }
    if (fullName) {
      found.fullName = fullName.trim();
    }
    if (phoneNumber) {
      found.phoneNumber = phoneNumber.trim();
    }
    if (imageUrl) {
      found.imageUrl = imageUrl.trim();
    }
    if (address) {
      found.address = address.trim();
    }

    try {
      await this.usersRepository.save(found);
      return found;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new InternalServerErrorException('Error saving user profile');
    }
  }
  async updateUserRole(
    updateUserInput: UpdateUserInput,
    id: string,
  ): Promise<User> {
    const user = await this.getUser(id);
    const { roles } = updateUserInput;
    if (roles) {
      user.roles = roles;
    }

    try {
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async getAuthUser(user: User): Promise<User> {
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    return user;
  }
}
