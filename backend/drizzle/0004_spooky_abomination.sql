ALTER TABLE "products" ADD COLUMN "image_id" text;--> statement-breakpoint
UPDATE "products" SET "image_id" = "image" WHERE "image_id" IS NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "comments_userId_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comments_productId_idx" ON "comments" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "products_userId_idx" ON "products" USING btree ("user_id");
