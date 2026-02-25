 import { baseApi } from "@/redux/api/baseApi";
 
 export const categoriesApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
     createCategory: builder.mutation<{ success: boolean }, { name: string }>({
       query: (body) => ({
         url: "/categories",
         method: "POST",
         data: body,
       }),
     }),
     getCategories: builder.query<unknown, void>({
       query: () => ({
         url: "/categories",
         method: "GET",
       }),
     }),
     updateCategory: builder.mutation<
       { success: boolean },
       { id: string; body: { name?: string } }
     >({
       query: ({ id, body }) => ({
         url: `/categories/${id}`,
         method: "PATCH",
         data: body,
       }),
     }),
     deleteCategory: builder.mutation<{ success: boolean }, { id: string }>({
       query: ({ id }) => ({
         url: `/categories/${id}`,
         method: "DELETE",
       }),
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
