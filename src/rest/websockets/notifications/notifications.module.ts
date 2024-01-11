import { Module } from '@nestjs/common'
import { FunkosNotificationsGateway } from './funkos-notifications.gateway'

@Module({
  providers: [FunkosNotificationsGateway],
  exports: [FunkosNotificationsGateway],
})
export class NotificationsModule {}
