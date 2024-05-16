import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SpecialProductService } from 'src/special-product/special-product.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private notifiedProducts = new Set<string>();
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private specialProductService: SpecialProductService,
  ) {}

  async create(notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(notificationData);
    return this.notificationRepository.save(notification);
  }
  async sendNotification(userId: string, message: string): Promise<void> {
    console.log(`Notification sent to user ${userId}: ${message}`);
  }
  @Cron(CronExpression.EVERY_MINUTE)
  async checkExpiredSpecialProducts() {
    const expiredProducts =
      await this.specialProductService.getExpiredSpecialProducts();
    try {
      for (const product of expiredProducts) {
        if (!this.notifiedProducts.has(product.id)) {
          const message = `Your special product "${product.title}" has expired.`;
          await this.create({ user: product.user, message });

          this.notifiedProducts.add(product.id);
        }
      }
    } catch (error) {
      this.logger.error('Error checking expired special products', error);
    }
  }

  async deleteAll(): Promise<void> {
    await this.notificationRepository.delete({});
  }
  async removeDuplicateNotifications(): Promise<void> {
    const notifications = await this.notificationRepository.find({
      relations: ['user'],
    });
    const seen = new Map<string, Notification>();

    for (const notification of notifications) {
      const key = `${notification.user.id}-${notification.message}`;
      if (seen.has(key)) {
        await this.notificationRepository.delete(notification.id);
      } else {
        seen.set(key, notification);
      }
    }
  }
  async getNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({ relations: ['user'] });
  }
  @Cron('*/30 * * * * *')
  async handleCron() {
    this.logger.log('Running cron job to remove duplicate notifications...');
    await this.removeDuplicateNotifications();
  }
}
