import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SpecialProductService } from 'src/special-product/special-product.service';
import { SpecialProductPrice } from 'src/special-product-price/entities/special-product-price.entity';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private notifiedProducts = new Set<string>();
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private specialProductService: SpecialProductService,

    @InjectRepository(SpecialProductPrice)
    private specialProductPriceRepository: Repository<SpecialProductPrice>,
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
      const currentTime = new Date();
      for (const product of expiredProducts) {
        const endingIn = new Date(product.endingIn);

        if (currentTime > endingIn && !this.notifiedProducts.has(product.id)) {
          console.log('currentTime', currentTime);
          console.log('endingIn', endingIn);
          const message = `Your special product "${product.title}" has expired.`;
          await this.create({ user: product.user, message });

          const lastBid = await this.specialProductPriceRepository.findOne({
            where: { specialProduct: { id: product.id } },

            relations: ['user'],
          });

          if (lastBid) {
            console.log(lastBid.user.id);
            const message = `The special product "${product.title}" you bid on has expired.`;
            await this.create({ user: lastBid.user, message });
          }

          this.notifiedProducts.add(product.id);

          product.notified = true;
          await this.specialProductService.save(product);
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
  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }
  @Cron('*/10 * * * * *')
  async handleCron() {
    this.logger.log('Running cron job to remove d uplicate notifications...');
    await this.removeDuplicateNotifications();
  }
}
