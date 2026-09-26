import { createComment, deleteComment } from "@/lib/api";
import type { CommentInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, content }: CommentInput) => createComment({ content, productId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ["product", variables.productId]})
    }
  })
};

export const useDeleteComment = (productId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] })
    }
  })
};