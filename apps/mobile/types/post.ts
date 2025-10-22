export interface Reaction {
  userAvatar: string;
  emoji: string;
}

export interface Post {
  userName: string;
  userHandle: string;
  userAvatar: string;
  location: string;
  timestamp: string;
  images: string[];
  caption?: string;
  comment: string;
  reactions: Reaction[];
}
