import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { commentController } from "../controllers/commentController.js";

const router = Router();

router.post("/:productId", requireAuth, commentController.createComment);

router.delete("/:id", requireAuth, commentController.deleteComment);

export default router;