import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type { IUser } from "@/types/auth.type";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: [apiTags.USER_LIST],
    }),
    updateUser: builder.mutation<
      IUser,
      { id: string; body: Partial<Pick<IUser, "role" | "status">> }
    >({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [apiTags.USER_LIST],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [apiTags.USER_LIST],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
