import ProductImgUpload from "@/components/ProductImgUpload";
import { toast } from "@/components/ui/toast";
import { useCreateProduct } from "@/hooks/useProducts";
import { useSession } from "@/lib/auth-client";
import { ArrowLeft, FileTextIcon, Sparkles, TypeIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";

export interface ProductImage {
  file: File | null;
  preview: string;
}

const CreateProductPage = () => {
  const { data: session } = useSession();

  if (!session) return <Navigate to="/login" />;

  const { mutate, isError, isPending } = useCreateProduct();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<ProductImage>({
    file: null,
    preview: "",
  });

  const reset = () => {
    setTitle("");
    setDescription("");
    if (image.file) URL.revokeObjectURL(image.preview);
    setImage({ file: null, preview: "" });
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !image.file) {
      return toast.add({
        type: "warning",
        description: "All fields are required",
      });
    }

    try {
      mutate(
        { title, description, file: image.file },
        {
          onSuccess: () => {
            reset();
            URL.revokeObjectURL(image.preview);
            toast.add({
              type: "success",
              description: "New product added successfully!",
            });
          },
          onError: (err) =>
            toast.add({ type: "error", description: err.message }),
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link to="/" className="btn btn-ghost btn-sm gap-1 mb-4">
        <ArrowLeft className="size-4" /> Back
      </Link>

      <div className="card bg-base-300">
        <div className="card-body">
          <h1 className="card-title">
            <Sparkles className="size-5 text-primary" />
            New Product
          </h1>

          <form onSubmit={handleUpload} className="space-y-4 mt-4">
            {/* TITLE INPUT */}
            <label className="input input-bordered flex items-center gap-2 bg-base-200">
              <TypeIcon className="size-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Product title"
                className="grow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            {/* IMAGE DROPZONE */}
            <ProductImgUpload
              image={image}
              setImage={setImage}
              isPending={isPending}
            />

            {/* DESCRIPTION INPUT */}
            <div className="form-control">
              <div className="flex items-start gap-2 p-3 rounded-box bg-base-200 border border-base-300">
                <FileTextIcon className="size-4 text-base-content/50 mt-1" />
                <textarea
                  placeholder="Description"
                  className="grow bg-transparent resize-none focus:outline-none min-h-24"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {isError && (
              <div role="alert" className="alert alert-error alert-sm">
                <span>Failed to create. Try again.</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner" />
              ) : (
                "Create Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
