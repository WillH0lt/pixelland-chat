import { Notification } from '@/graphql/types.gen'

interface Extension {
  notificationAddedDate: Date
  notificationAddedTimeSince: string
}

export type ExtendedNotification = Notification & Extension
