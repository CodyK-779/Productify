import type { StripEmptyObjects } from "better-auth/react";

export type User = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  emailVerified: boolean;
  imgPublicId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Product = {
 id: string;
 title: string;
 description: string;
 image: string;
 imageId: string;
 createdAt: Date;
 updatedAt: Date;
 userId: string;
};

export type Comment = {
 id: string;
 createdAt: Date;
 updatedAt: Date;
 userId: string;
 content: string;
 productId: string;
};

export type CommentWithUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  productId: string;
  user: User
};

export type MyProducts = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageId: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
};;

export interface ProductDetails extends MyProducts {
  comments: CommentWithUser[];
};

export type ProductInput = {
  title: string;
  description: string;
  file: File;
};

export type CommentInput = {
  content: string;
  productId: string;
};

export type Session = {
  user: StripEmptyObjects<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  }>;
  session: StripEmptyObjects<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  }>;
} | null