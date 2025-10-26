import { User } from './user';

export interface Reaction {
  userAvatar: string;
  emoji: string;
}

export interface Image {
  url: string;
  width: number;
  height: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface Post {
  user: User;
  location: string;
  timestamp: string;
  images: Image[];
  caption?: string;
  comment: string;
  reactions: Reaction[];
  seen?: boolean;
}
