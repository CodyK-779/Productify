import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from "@/lib/api"
import type { ProductInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  const { data, isPending, error } = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  return { data, isPending, error };
};

export const useGetProductById = (id: string) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  return { data, isPending, error };
};

export const useGetMyProducts = () => {
  const { data, isPending, error } = useQuery({ queryKey: ["myProducts"], queryFn: getMyProducts });
  return { data, isPending, error };
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, ...productData}: { id: string } & Partial<ProductInput>) => updateProduct(id, productData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
};