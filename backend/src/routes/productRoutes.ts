import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", productController.getAllProducts);

router.get("/my", requireAuth, productController.getMyProducts);

router.get("/:id", productController.getProductById);

router.post("/", requireAuth, productController.createProduct);

router.put("/:id", requireAuth, productController.updateProduct);

router.delete("/:id", requireAuth, productController.deleteProduct);

export default router;