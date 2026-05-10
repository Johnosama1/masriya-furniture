import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductCategory = "children" | "adult" | "living" | "videos";

export type Product = {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  price: number | null;
  discountPercent: number | null;
  category: ProductCategory;
  subcategory: string | null;
  measurements: string | null;
  images: string[];
  videoUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type CreateProductInput = {
  name: string;
  nameEn: string;
  description: string;
  price?: number | null;
  discountPercent?: number | null;
  category: ProductCategory;
  subcategory?: string | null;
  measurements?: string | null;
  images: string[];
  videoUrl?: string | null;
  sortOrder?: number;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export type CategorySummary = {
  category: string;
  count: number;
  label: string;
};

// ─── Alias for backwards compatibility ───────────────────────────────────────
export type ListProductsCategory = ProductCategory;

// ─── Fetch helpers ───────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }
  return res.json() as Promise<T>;
}

// ─── Query Keys ──────────────────────────────────────────────────────────────

export const getListProductsQueryKey = (params?: {
  category?: ProductCategory;
  subcategory?: string;
}) => ["/api/products", params ?? {}] as const;

export const getProductQueryKey = (id: number) =>
  ["/api/products", id] as const;

export const getCategoriesSummaryQueryKey = () =>
  ["/api/categories/summary"] as const;

// ─── Hooks ───────────────────────────────────────────────────────────────────

export function useListProducts(
  params?: { category?: ProductCategory; subcategory?: string },
  options?: { query?: Omit<UseQueryOptions<Product[]>, "queryKey" | "queryFn"> },
) {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.subcategory) search.set("subcategory", params.subcategory);
  const qs = search.toString() ? `?${search.toString()}` : "";

  return useQuery<Product[]>({
    queryKey: getListProductsQueryKey(params),
    queryFn: () => apiFetch<Product[]>(`/api/products${qs}`),
    ...options?.query,
  });
}

export function useGetProduct(
  id: number,
  options?: { query?: Omit<UseQueryOptions<Product>, "queryKey" | "queryFn"> },
) {
  return useQuery<Product>({
    queryKey: getProductQueryKey(id),
    queryFn: () => apiFetch<Product>(`/api/products/${id}`),
    enabled: !!id,
    ...options?.query,
  });
}

export function useGetCategoriesSummary() {
  return useQuery<CategorySummary[]>({
    queryKey: getCategoriesSummaryQueryKey(),
    queryFn: () => apiFetch<CategorySummary[]>("/api/categories/summary"),
  });
}

export function useCreateProduct(
  options?: UseMutationOptions<Product, Error, { data: CreateProductInput }>,
) {
  return useMutation<Product, Error, { data: CreateProductInput }>({
    mutationFn: ({ data }) =>
      apiFetch<Product>("/api/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useUpdateProduct(
  options?: UseMutationOptions<
    Product,
    Error,
    { id: number; data: UpdateProductInput }
  >,
) {
  return useMutation<Product, Error, { id: number; data: UpdateProductInput }>({
    mutationFn: ({ id, data }) =>
      apiFetch<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    ...options,
  });
}

export function useDeleteProduct(
  options?: UseMutationOptions<{ success: boolean }, Error, { id: number }>,
) {
  return useMutation<{ success: boolean }, Error, { id: number }>({
    mutationFn: ({ id }) =>
      apiFetch<{ success: boolean }>(`/api/products/${id}`, {
        method: "DELETE",
      }),
    ...options,
  });
}
