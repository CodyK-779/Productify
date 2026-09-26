import { createProduct, deleteProduct, getAllProducts, getMyProducts, getProductById, updateProduct } from "@/lib/api"
import { productKeys } from "@/lib/productKeys";
import type { ProductInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetAllProducts = () => {
  const { data, error, isPending } = useQuery({ queryKey: productKeys.all, queryFn: getAllProducts, staleTime: Infinity });
  return { data, error, isPending }
};

export const useGetProductById = (id: string) => {
  const { data, error, isPending } = useQuery({ queryKey: productKeys.details(id), queryFn: () => getProductById(id), staleTime: Infinity, enabled: !!id });
  return { data, error, isPending };
};

export const useGetMyProducts = () => {
  const { data, error, isPending } = useQuery({ queryKey: productKeys.myProducts, queryFn: getMyProducts, staleTime: Infinity });
  return { data, error, isPending }
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts });
    }
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts });
      queryClient.removeQueries({ queryKey: productKeys.details(id) });
    }
  })
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...productData }: { id: string } & Partial<ProductInput>) => updateProduct(id, productData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.myProducts });
      queryClient.invalidateQueries({ queryKey: productKeys.details(id) });
    }
  })
};