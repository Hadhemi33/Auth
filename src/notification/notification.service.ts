import { Injectable } from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import { SpecialProductPriceService } from 'src/special-product-price/special-product-price.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NotificationService {
  constructor(
    private readonly specialProductPriceService: SpecialProductPriceService,
    private readonly userService: UserService,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async notifyPreviousHighestBidder() {
    const bidsToNotify =
      await this.specialProductPriceService.getBidsToNotify();

    for (const bid of bidsToNotify) {
      await this.userService.sendNotification(
        bid.userId,
        `A higher bid of ${bid.newPrice} has been placed for the product ${bid.productTitle}`,
      );
      await this.specialProductPriceService.markBidAsNotified(bid.id);
    }
  }
}
