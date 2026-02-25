import type { IUser } from "@/types/auth.type";
import Cookies from "js-cookie";
import { baseApi } from "@/redux/api/baseApi";

type AuthResponse = {
  user: IUser;
  accessToken: string;
};

const getAuthPayload = (
  resp: unknown,
): { user?: IUser; accessToken?: string } => {
  if (resp && typeof resp === "object") {
    const top = resp as {
      user?: IUser;
      accessToken?: string;
      data?: { user?: IUser; accessToken?: string };
    };
    if (top.user && top.accessToken) {
      return { user: top.user, accessToken: top.accessToken };
    }
    if (top.data?.user && top.data?.accessToken) {
      return { user: top.data.user, accessToken: top.data.accessToken };
    }
  }
  return {};
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        data: body,
      }),
      transformResponse: (
        resp: import("@/types/api.type").ApiResponse<AuthResponse>,
      ) => resp.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.accessToken) {
            Cookies.set("accessToken", data.accessToken!, {
              expires: 7,
              sameSite: "lax",
              secure:
                typeof window !== "undefined" &&
                window.location.protocol === "https:",
            });
            Cookies.set("role", data.user!.role, {
              expires: 7,
              sameSite: "lax",
              secure:
                typeof window !== "undefined" &&
                window.location.protocol === "https:",
            });
          }
        } catch {}
      },
    }),

    register: builder.mutation<
      { success: boolean; data: IUser },
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        data: body,
      }),
    }),

    refreshToken: builder.mutation<AuthResponse, { refreshToken?: string }>({
      query: (body) => ({
        url: "/users/refresh-token",
        method: "POST",
        data: body,
      }),
      transformResponse: (
        resp: import("@/types/api.type").ApiResponse<AuthResponse>,
      ) => resp.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user && data?.accessToken) {
            Cookies.set("accessToken", data.accessToken!, {
              expires: 7,
              sameSite: "lax",
              secure:
                typeof window !== "undefined" &&
                window.location.protocol === "https:",
            });
            Cookies.set("role", data.user!.role, {
              expires: 7,
              sameSite: "lax",
              secure:
                typeof window !== "undefined" &&
                window.location.protocol === "https:",
            });
          } else {
            Cookies.remove("accessToken");
            Cookies.remove("role");
          }
        } catch {
          Cookies.remove("accessToken");
          Cookies.remove("role");
        }
      },
    }),

    logoutUser: builder.mutation<
      { success: boolean },
      { refreshToken?: string }
    >({
      query: (body) => ({
        url: "/users/logout",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_, { dispatch }) {
        Cookies.remove("accessToken");
        Cookies.remove("role");
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;
