 import { baseApi } from "@/redux/api/baseApi";
 import type { IUser } from "@/types/auth.type";
 
 export const usersApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
     getUsers: builder.query<IUser[], void>({
       query: () => ({
         url: "/users",
         method: "GET",
       }),
     }),
     updateUser: builder.mutation<IUser, { id: string; body: Partial<IUser> }>({
       query: ({ id, body }) => ({
         url: `/users/${id}`,
         method: "PATCH",
         data: body,
       }),
     }),
     deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
       query: ({ id }) => ({
         url: `/users/${id}`,
         method: "DELETE",
       }),
     }),
   }),
  overrideExisting: false,
});
 
 export const {
   useGetUsersQuery,
   useUpdateUserMutation,
   useDeleteUserMutation,
 } = usersApi;
