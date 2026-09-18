import type { Comment, CommentInput, MyProducts, Product, ProductDetails, ProductInput } from "@/types";
import api from "./axios";

// Products API
export const getAllProducts = async (): Promise<MyProducts[]> => {
  const { data } = await api.get<MyProducts[]>("/products");
  return data;
};

export const getProductById = async (id: string): Promise<ProductDetails> => {
  const { data } = await api.get<ProductDetails>(`/products/${id}`);
  return data;
};

export const getMyProducts = async (): Promise<MyProducts[]> => {
  const { data } = await api.get<MyProducts[]>("/products/my");
  return data;
};

export const createProduct = async (productData: ProductInput): Promise<Product> => {
  const { data } = await api.post<Product>("/products", productData);
  return data;
};

export const updateProduct = async (id: string, productData: Partial<ProductInput>): Promise<Product> => {
  const { data } = await api.put<Product>(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/products/${id}`);
  return data;
};

// Comments API
export const createComment = async ({ content, productId }: CommentInput): Promise<Comment> => {
  const { data } = await api.post<Comment>(`/comments/${productId}`, { content });
  return data;
};

export const deleteComment = async (id: string): Promise<{ message: string }> => {
  const { data } = await api.delete<{ message: string }>(`/comments/${id}`);
  return data;
};