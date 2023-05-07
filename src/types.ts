import { Session } from "next-auth";

export interface iUser {
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  posts?: iPost[];
}

export interface iPost {
  postId: string;
  image: string;
  description: string;
  createdAt: string;
  userId: string;
  user: iUser;
  comments: [];
  userLikes: [];
  totalLikes: number;
  isLiked: boolean;
}

export interface iMySession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

export interface iComment {
  commentId: string;
  description: string;
  image: string;
  createdAt: string;
  postId: string;
  userId: string;
  user: {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
  userLike: [];
  isLiked: boolean;
  totalLikes: number;
}
