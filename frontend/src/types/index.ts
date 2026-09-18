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
  image: string;
  imageId: string;
};

export type CommentInput = {
  content: string;
  productId: string;
};