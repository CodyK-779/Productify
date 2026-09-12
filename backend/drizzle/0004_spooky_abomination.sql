ALTER TABLE "products" ADD COLUMN "image_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "comments_userId_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_productId_idx" ON "comments" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_userId_idx" ON "products" USING btree ("user_id");