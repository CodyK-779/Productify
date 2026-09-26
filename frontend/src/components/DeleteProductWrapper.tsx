import { useDeleteProduct } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useNavigate } from "react-router";
import { toast } from "./ui/toast";
import type { ReactElement } from "react";

interface Props {
  productId: string;
  children: ReactElement;
  path: string;
}

const DeleteProductWrapper = ({ productId, children, path }: Props) => {
  const { mutate, isPending } = useDeleteProduct();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      mutate(productId, {
        onSuccess: () => {
          toast.add({
            type: "success",
            description: "Product deleted successfully!",
          });
          navigate(path);
        },
        onError: (err) => {
          toast.add({ type: "error", description: err.message });
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger render={children} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <span>Confirm</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductWrapper;
