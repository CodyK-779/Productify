import { v2 as cloudinary } from "cloudinary";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!
});

export async function uploadProductImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
  try {
    if (!file) throw new Error("No file provided");
    if (!file.mimetype.startsWith("image/")) throw new Error("Only images are allowed");
    if (file.size > 5 * 1024 * 1024) throw new Error("Selected image exceeds 5MB limit");

    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: "productify_products", resource_type: "image", allowed_formats: ["jpg", "png", "webp"]
      }, (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Upload failed: No result returned from Cloudinary"));
        resolve(result)
      })
      uploadStream.end(file.buffer)
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    }
  } catch (error) {
    console.error(error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload image");
  }
}