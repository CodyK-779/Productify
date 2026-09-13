import { Router } from "express";
import { userController } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/users/:id - Get single user by ID
router.get("/:id", requireAuth, userController.getUserById);

// PUT /api/users/:id - Update user
router.put("/:id", requireAuth, userController.updateUser);

export default router;