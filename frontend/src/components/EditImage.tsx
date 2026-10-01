import { Img } from "@page-speed/img";
import type { EditProductImage } from "./EditProduct";
import { Camera, Trash2 } from "lucide-react";
import type { ChangeEvent } from "react";
import { toast } from "./ui/toast";

interface Props {
  editImage: EditProductImage;
  setEditImage: React.Dispatch<React.SetStateAction<EditProductImage>>;
  isPending: boolean;
}

const EditImage = ({ editImage, setEditImage, isPending }: Props) => {
  const VALID_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      toast.add({
        type: "warning",
        description: "Please select valid image (JPEG, PNG, WEBP)",
      });
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.add({
        type: "warning",
        description: "Selected image exceeds 5MB limit.",
      });
      e.target.value = "";
      return;
    }

    setEditImage((prev) => {
      if (prev.file && prev.preview) URL.revokeObjectURL(prev.preview);
      return { ...prev, file, preview: URL.createObjectURL(file) };
    });

    e.target.value = "";
  };

  const handleRemove = () => {
    setEditImage((prev) => {
      if (prev.file) URL.revokeObjectURL(prev.preview);
      return { ...prev, file: null, preview: prev.originalUrl };
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white/90">
          Product Image
        </label>
        <span className="text-xs text-white/50">PNG, JPG, WEBP up to 5MB</span>
      </div>

      <label
        htmlFor="product-image"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/3 transition hover:border-white/30 hover:bg-white/6"
      >
        {/* Image preview */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Img
            src={editImage.preview}
            alt="product-image"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 backdrop-blur-[2px] transition duration-300 group-hover:opacity-100">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm">
            <Camera className="size-5 text-white" />
          </div>
          <span className="text-xs font-medium text-white">
            Click to change
          </span>
        </div>

        {editImage.file && (
          <button
            onClick={handleRemove}
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-black/60 text-white/90 ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-red-500/80 hover:text-white cursor-pointer"
          >
            <Trash2 className="size-4" />
          </button>
        )}

        {editImage.preview !== editImage.originalUrl && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            New
          </span>
        )}
      </label>

      <input
        id="product-image"
        type="file"
        accept="image/*"
        disabled={isPending}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Footer hint */}
      <p className="text-[11px] text-white/40">
        Drag and drop or click to upload a new image.
      </p>
    </div>
  );
};

export default EditImage;
