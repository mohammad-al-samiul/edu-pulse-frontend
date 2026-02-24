import { createApi } from "@reduxjs/toolkit/query/react";

import { setCredentials, logout } from "./authSlice";
import { axiosBaseQuery } from "@/src/lib/axiosBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            }),
          );
        } catch {}
      },
    }),

    register: builder.mutation({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        data: body,
      }),
    }),

    refreshToken: builder.mutation({
      query: (body) => ({
        url: "/users/refresh-token",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          dispatch(
            setCredentials({
              user: data.user,
              accessToken: data.accessToken,
            }),
          );
        } catch {
          dispatch(logout());
        }
      },
    }),

    logoutUser: builder.mutation({
      query: (body) => ({
        url: "/users/logout",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(logout());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;
