import type { ProductImage } from "@/pages/CreateProductPage";
import { ImageIcon, XIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { toast } from "./ui/toast";

interface Props {
  image: ProductImage;
  setImage: React.Dispatch<React.SetStateAction<ProductImage>>;
  isPending: boolean;
}

const ProductImgUpload = ({ image, setImage, isPending }: Props) => {
  const VALID_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        type: "info",
        description: "Selected image exceeds 5MB limit.",
      });
      e.target.value = "";
      return;
    }

    if (!VALID_TYPES.includes(file.type)) {
      toast.add({
        type: "info",
        description: "Please select valid image (JPEG, PNG, WEBP)",
      });
      e.target.value = "";
      return;
    }

    setImage({
      file,
      preview: URL.createObjectURL(file),
    });
    e.target.value = "";
  };

  const handleRemove = () => {
    setImage((prev) => {
      if (prev.file) URL.revokeObjectURL(prev.preview);
      return { file: null, preview: "" };
    });
  };

  return (
    <>
      <label
        htmlFor="product-image"
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-box border-2 border-dashed border-primary/60 transition-colors cursor-pointer"
        onClick={(e) => {
          if (image.file) {
            e.preventDefault();
            return toast.add({
              type: "info",
              description: "You can only upload 1 image per product",
            });
          }
        }}
      >
        <ImageIcon className="size-8 text-base-content/50" />
        <div className="text-center">
          <p className="font-medium">Drag & drop an image</p>
          <p className="text-xs text-base-content/60 mt-1">
            or click to browse — PNG, JPG, WEBP up to 5MB
          </p>
        </div>

        <input
          id="product-image"
          name="product-image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isPending || image.file !== null}
        />
      </label>

      {image.preview && (
        <div className="relative group rounded-box overflow-hidden border border-base-300 bg-base-200">
          <img
            src={image.preview}
            alt="Product preview"
            className="w-full max-h-72 object-cover"
          />

          {/* subtle gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

          {/* filename pill */}
          <div className="absolute bottom-2 left-2 right-14 flex items-center gap-2">
            <span className="badge badge-sm badge-neutral/80 backdrop-blur-sm max-w-full truncate">
              {image.file?.name}
            </span>
          </div>

          {/* remove button */}
          <button
            type="button"
            className="btn btn-circle btn-sm btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image"
            onClick={handleRemove}
          >
            <XIcon className="size-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default ProductImgUpload;
