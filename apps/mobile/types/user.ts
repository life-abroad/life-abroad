import { Post } from './post';

export interface User {
  userName: string;
  userHandle: string;
  userAvatar: string;
  profileUrl: string;
}

export interface UserProfile extends User {
  friends: User[];
  circles: {
    name: string;
    color: string;
    users: User[];
  }[];
  posts: Post[];
}
