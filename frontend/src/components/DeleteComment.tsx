import { Loader2, Trash2Icon } from "lucide-react";
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
import { useDeleteComment } from "@/hooks/useComments";
import { toast } from "./ui/toast";

interface Props {
  commentId: string;
  productId: string;
}

const DeleteComment = ({ commentId, productId }: Props) => {
  const { mutate, isPending } = useDeleteComment(productId);

  const handleDelete = async () => {
    try {
      mutate(commentId, {
        onSuccess: () => {
          toast.add({ type: "success", description: "Comment deleted" });
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
      <AlertDialogTrigger
        render={<button className="btn btn-ghost btn-xs text-error" aria-label="Delete comment" />}
      >
        <Trash2Icon className="size-3" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete confirmation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            disabled={isPending}
            onClick={handleDelete}
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

export default DeleteComment;
