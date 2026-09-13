import type { Request, Response } from "express"
import { db } from "../db/db.js";
import { User, user } from "../db/schema/auth-schema.js";
import { eq } from "drizzle-orm";

export const userController = {
  getUserById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
    
      const selectedUser = await db.query.user.findFirst({
        where: eq(user.id, String(id)),
        with: {
          products: true,
          comments: true
        }
      })

      if (!selectedUser) return res.status(404).json({ error: "User not found" });

      res.json(selectedUser)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to get user" })
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, image, imgPublicId } = req.body;

      const updateData: Partial<User> = {};

      if (name !== undefined) {
        if (typeof name !== "string") return res.status(400).json({ error: "Invalid name" });
      }
      updateData.name = name.trim();

      if (email !== undefined) {
        if (typeof email !== "string") return res.status(400).json({ error: "Invalid email" });
      }
      updateData.email = email.trim();

      if (image !== undefined) updateData.image = image;
      if (imgPublicId !== undefined) updateData.imgPublicId = imgPublicId;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }

      const [updatedUser] = await db.update(user).set(updateData).where(eq(user.id, String(id))).returning();

      if (!updatedUser) return res.status(404).json({ error: "User not found" });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to update user" })
    }
  }
}
