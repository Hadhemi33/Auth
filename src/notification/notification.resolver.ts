import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}
  @Mutation(() => String)
  async deleteAllNotification(): Promise<string> {
    await this.notificationService.deleteAll();
    return 'All notification deleted successfully';
  }
  @Query(() => [Notification])
  async getNotifications(): Promise<Notification[]> {
    return this.notificationService.getNotifications();
  }
  @Mutation(() => String)
  async deleteNotification(@Args('id') id: string) {
    await this.notificationService.deleteNotification(id);
    return 'NOtification was deleted';
  }
}
