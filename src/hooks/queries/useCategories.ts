import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type CategoriesResponse = {
  data: Category[];
};

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get<CategoriesResponse>("/categories");
      return res.data.data;
    },
  });
}

