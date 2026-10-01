import type { Request, Response } from "express";
import { db } from "../db/db.js";
import { Product, products } from "../db/schema/app.js";
import { and, eq } from "drizzle-orm";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { buildImageUrl, deleteProductImage, uploadProductImage } from "../lib/img-upload.js";

/**
 * Shapes a product row for API responses.
 * ⚠️ Overrides `image` — the DB stores the raw Cloudinary secure_url,
 * but we always serve an optimized URL built from `imageId`.
 */
const shapeProduct = (product: Product) => {
  const { image: _legacyImage, ...rest } = product;

  return {
    ...rest,
    image: buildImageUrl(product.imageId)
  }
};

export const productController = {
  getAllProducts: async (req: Request, res: Response) => {
    try {
      const allProducts = await db.query.products.findMany({
        with: { user: true },
        orderBy: (products, { desc }) => [desc(products.createdAt)],
      })

      res.json(allProducts.map(shapeProduct));
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

      res.json(product.map(shapeProduct));
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

      res.json(shapeProduct(product));
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

      const { title, description } = req.body;
      const file = req.file;

      if (!title || !description || !file) {
        return res.status(400).json({ error: "Title, description, image,  and imageId are required" });
      }

      const result = await uploadProductImage(file);

      const newProductData = { title, description, image: result.secure_url, imageId: result.public_id, userId: session.user.id }

      await db.insert(products).values(newProductData);
      
      res.status(201).json({ message: "Product created successfully!" });
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
      const { title, description } = req.body;

      const updateData: Partial<Product> = {};
      let oldImageId: string | null = null;

      if (title !== undefined) {
        if (typeof title !== "string") return res.status(400).json({ error: "Title must be a string" });
        updateData.title = title.trim();
      }

      if (description !== undefined) {
        if (typeof description !== "string") return res.status(400).json({ error: "Description must be a string" });
        updateData.description = description.trim();
      }

      if (req.file) {
        const existing = await db.query.products.findFirst({
          where: and (
            eq(products.id, String(id)),
            eq(products.userId, session.user.id)
          ),
          columns: { imageId: true }
        });

        if (!existing) return res.status(404).json({ error: "Product not found or unauthorized" });
        oldImageId = existing.imageId;

        const result = await uploadProductImage(req.file);
        updateData.image = result.secure_url;
        updateData.imageId = result.public_id;
      }

      if (Object.keys(updateData).length === 0) return res.status(400).json({ error: "No fields to update" });

      const [updatedProduct] = await db.update(products).set(updateData).where(
        and (
          eq(products.id, String(id)),
          eq(products.userId, session.user.id)
        )
      ).returning();

      if (!updatedProduct) {
        if (req.file && updateData.imageId) {
          deleteProductImage(updateData.imageId).catch((err) => console.warn("Rollback: failed to delete new image:", err))
        }

        return res.status(404).json({ error: "Product not found or unauthorized" });
      }

      if (req.file && oldImageId && oldImageId !== updateData.imageId) {
        deleteProductImage(oldImageId).catch((err) => console.warn("Failed to delete old cloudinary image:", err))
      };

      res.status(200).json({ message: "Product updated successfully!" });
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

      deleteProductImage(deletedProduct.imageId).catch(err => console.warn("Failed to delete cloudinary image:", err));

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
}
