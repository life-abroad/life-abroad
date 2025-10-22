export interface Reaction {
  userAvatar: string;
  emoji: string;
}

export interface Post {
  user: User;
  location: string;
  timestamp: string;
  images: string[];
  caption?: string;
  comment: string;
  reactions: Reaction[];
}
