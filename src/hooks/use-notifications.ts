"use client";

import { useSyncExternalStore } from "react";
import {
  getLastReadAt,
  getLastReadAtServer,
  getNotifications,
  getNotificationsServer,
  markAllNotificationsRead,
  subscribeNotifications,
  type AppNotification,
} from "@/lib/data/notifications-store";

/**
 * Reactive view over the notifications store: the items, how many are unread
 * (newer than the read cursor), and a way to mark them all read.
 */
export function useNotifications(): {
  items: AppNotification[];
  unread: number;
  lastReadAt: string;
  markAllRead: () => void;
} {
  const items = useSyncExternalStore(
    subscribeNotifications,
    getNotifications,
    getNotificationsServer,
  );
  const lastReadAt = useSyncExternalStore(
    subscribeNotifications,
    getLastReadAt,
    getLastReadAtServer,
  );

  const unread = items.filter((n) => n.at > lastReadAt).length;

  return { items, unread, lastReadAt, markAllRead: markAllNotificationsRead };
}
