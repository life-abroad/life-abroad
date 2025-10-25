import { User } from './user';

export interface ChatRow {
  user: User;
  unreadCount: number;
  lastMessage: string;
  timestamp: string;
}

export interface Bulletin {
  user: User;
  content: string;
  timestamp: string;
}
