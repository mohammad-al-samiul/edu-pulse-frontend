import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type {
  ICategory,
  ICategoryCreate,
  ICategoryUpdate,
} from "@/types/category.type";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation<ICategory, ICategoryCreate>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.CATEGORY_LIST],
    }),
    getCategories: builder.query<ICategory[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      transformResponse: (response: {
        data: {
          mode: string;
          data: ICategory[];
          meta?: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }) => response.data.data,
      providesTags: [apiTags.CATEGORY_LIST],
    }),
    updateCategory: builder.mutation<
      ICategory,
      { id: string; body: ICategoryUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [apiTags.CATEGORY, apiTags.CATEGORY_LIST],
    }),
    deleteCategory: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [apiTags.CATEGORY_LIST],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
