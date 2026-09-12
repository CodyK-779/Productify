import { Request, Response } from "express";
import { db } from "../db/db.js";
import { Product, products } from "../db/schema/app.js";
import { and, eq } from "drizzle-orm";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const productController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const allProducts = await db.query.products.findMany({
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      })

      res.json(allProducts);
    } catch (error) {
      console.error("Error getting products:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  },

  getMyProducts: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const product = await db.query.products.findMany({
        where: eq(products.userId, session.user.id),
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)]
      });

      res.json(product);
    } catch (error) {
      console.error("Error getting user products:", error);
      res.status(500).json({ error: "Failed to get user products" });
    }
  },

  getProductById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const product = await db.query.products.findFirst({
        where: eq(products.id, String(id)),
        with: {
          user: true,
          comments: {
            with: { user: true },
            orderBy: (comments, { desc }) => [desc(comments.createdAt)]
          }
        }
      });

      if (!product) return res.status(404).json({ error: "Product not found" });

      res.json(product);
    } catch (error) {
      console.error("Error getting product:", error);
      res.status(500).json({ error: "Failed to get product" });
    }
  },

  createProduct: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const { title, description, image, imageId } = req.body;

      if (!title || !description || !image || !imageId) {
        return res.status(400).json({ error: "Title, description, image,  and imageId are required" });
      }

      const newProductData = { title, description, image, imageId, userId: session.user.id }

      const [newProduct] = await db.insert(products).values(newProductData).returning();
      
      res.status(201).json(newProduct)
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Failed to create product" });
    }
  },
  
  updateProduct: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;
      const { title, description, image, imageId } = req.body;

      const updateData: Partial<Product> = {};

      if (title !== undefined) {
        if (typeof title !== "string") return res.status(400).json({ error: "Invalid title" })
      }
      updateData.title = title.trim();

      if (description !== undefined) {
        if (typeof description !== "string") return res.status(400).json({ error: "Invalid description" });
      }
      updateData.description = description.trim();

      if (title !== undefined) {
        if (typeof title !== "string") return res.status(400).json({ error: "Title must be a string" });
        updateData.title = title.trim();
      }
      if (description !== undefined) {
        if (typeof description !== "string") return res.status(400).json({ error: "Description must be a string" });
        updateData.description = description.trim();
      }
      if (image !== undefined) updateData.image = image;
      if (imageId !== undefined) updateData.imageId = imageId;

      if (Object.keys(updateData).length === 0) return res.status(400).json({ error: "No fields to update" });

      const [updatedProduct] = await db.update(products).set(updateData).where(
        and (
          eq(products.id, String(id)),
          eq(products.userId, session.user.id)
        )
      ).returning();

      if (!updatedProduct) return res.status(404).json({ error: "Product not found or unauthorized" });

      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;

      const [deletedProduct] = await db.delete(products).where(and (
          eq(products.id, String(id)),
          eq(products.userId, session.user.id)
        )
      ).returning();

      if (!deletedProduct) return res.status(404).json({ error: "Product not found or unauthorized" });

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}
