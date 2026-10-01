import type { ProductDetails } from "@/types";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useUpdateProduct } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import EditImage from "./EditImage";
import { toast } from "./ui/toast";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: ProductDetails;
}

export interface EditProductImage {
  file: File | null;
  preview: string;
  originalUrl: string;
}

const EditProduct = ({ open, setOpen, product }: Props) => {
  const { mutate, isPending } = useUpdateProduct();

  const [editProduct, setEditProduct] = useState({
    title: product.title || "",
    description: product.description || "",
  });
  const [editImage, setEditImage] = useState<EditProductImage>({
    file: null,
    preview: product.image,
    originalUrl: product.image,
  });

  useEffect(() => {
    setEditProduct({
      title: product.title || "",
      description: product.description || "",
    });
    setEditImage((prev) => {
      if (prev.file) URL.revokeObjectURL(prev.preview);
      return {
        file: null,
        preview: product.image,
        originalUrl: product.image,
      };
    });
  }, [product.title, product.description, product.image]);

  const handleSubmit = async () => {
    const { title, description } = editProduct;
    if (!title.trim() || !description.trim()) {
      return toast.add({
        type: "warning",
        description: "Title and Description are required.",
      });
    }

    const updateData: any = {};
    if (product.title !== editProduct.title)
      updateData.title = editProduct.title;
    if (product.description !== editProduct.description)
      updateData.description = editProduct.description;
    if (editImage.file) updateData.file = editImage.file;

    mutate(
      { id: product.id, ...updateData },
      {
        onSuccess: () => {
          setOpen(false);
          toast.add({
            type: "success",
            description: "Product updated successfully!",
          });
        },
        onError: (err) =>
          toast.add({ type: "error", description: err.message }),
      },
    );
  };

  const handleClose = () => {
    setEditProduct({
      title: product.title || "",
      description: product.description || "",
    });

    if (editImage.file) URL.revokeObjectURL(editImage.preview);

    setEditImage({
      file: null,
      preview: product.image,
      originalUrl: product.image,
    });
  };

  const unchanged =
    product.title === editProduct.title &&
    product.description === editProduct.description &&
    editImage.file === null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-white" onClose={handleClose}>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to this product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={editProduct.title}
              onChange={(e) =>
                setEditProduct({ ...editProduct, title: e.target.value })
              }
              placeholder="Enter product title"
            />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
              placeholder="Enter product description"
            />
          </Field>
        </FieldGroup>
        <EditImage
          editImage={editImage}
          setEditImage={setEditImage}
          isPending={isPending}
        />
        <DialogFooter>
          <DialogClose
            render={
              <Button
                variant="outline"
                onClick={handleClose}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            }
          />
          <Button
            onClick={handleSubmit}
            disabled={unchanged || isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save changes</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
