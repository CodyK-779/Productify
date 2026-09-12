import { Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "../db/db.js";
import { comments, products } from "../db/schema/app.js";
import { and, eq } from "drizzle-orm";

const isProductForeignKeyViolation = (error: unknown) => {
  if (typeof error !== "object" || error === null) return false;

  const databaseError = error as { code?: string; constraint?: string };
  return databaseError.code === "23503"
    && databaseError.constraint === "comments_product_id_products_id_fk";
};

export const commentController = {
  createComment: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const { content, productId } = req.body;

      if (!content || !productId) return res.status(400).json({ error: "Missing fields" });

      const product = await db.query.products.findFirst({
        columns: { id: true },
        where: eq(products.id, productId)
      });

      if (!product) return res.status(404).json({ error: "Product not found" });

      let newComment;
      try {
        [newComment] = await db.insert(comments).values({ content, productId, userId: session.user.id }).returning();
      } catch (error) {
        if (isProductForeignKeyViolation(error)) {
          return res.status(404).json({ error: "Product not found" });
        }

        throw error;
      }

      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  },

  deleteComment: async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
      });

      if (!session) return res.status(401).json({ error: "Unauthorized" });

      const { id } = req.params;

      const [deletedComment] = await db.delete(comments).where(and (
        eq(comments.id, String(id)),
        eq(comments.userId, session.user.id)
      )).returning();

      if (!deletedComment) return res.status(404).json({ error: "Comment not found or unauthorized" });

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
}
