import { createApi } from "@reduxjs/toolkit/query/react";

import { setCredentials, logout } from "./authSlice";
import { axiosBaseQuery } from "@/lib/axiosBaseQuery";
import type { IUser } from "@/types/auth.type";

type AuthResponse = {
  user: IUser;
  accessToken: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ??
      "https://edu-pulse-backend-plum.vercel.app/api/v1",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
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

    logoutUser: builder.mutation<{ success: boolean }, { refreshToken?: string }>({
      query: (body) => ({
        url: "/users/logout",
        method: "POST",
        data: body,
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(logout());
      },
    }),

    // User management (admin)
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

    // Categories (admin)
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

    // Courses (instructor + public listing)
    createCourse: builder.mutation<
      unknown,
      {
        title: string;
        description: string;
        price: number;
        categoryId: string;
        isFree: boolean;
      }
    >({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        data: body,
      }),
    }),
    getCourses: builder.query<
      unknown,
      { page?: number; limit?: number; categoryId?: string; status?: string }
    >({
      query: ({ page, limit, categoryId, status } = {}) => ({
        url: "/courses",
        method: "GET",
        params: {
          page,
          limit,
          categoryId,
          status,
        },
      }),
    }),
    updateCourse: builder.mutation<
      unknown,
      { id: string; body: Partial<{ status: string }> }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        data: body,
      }),
    }),
    getCourseById: builder.query<unknown, { id: string }>({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
    }),

    // Lessons
    createLesson: builder.mutation<
      unknown,
      {
        title: string;
        content: string;
        videoUrl: string;
        order: number;
        isPreview: boolean;
        courseId: string;
      }
    >({
      query: (body) => ({
        url: "/lessons",
        method: "POST",
        data: body,
      }),
    }),
    completeLesson: builder.mutation<
      unknown,
      { lessonId: string; progress: number; status: string }
    >({
      query: ({ lessonId, ...body }) => ({
        url: `/lessons/complete/${lessonId}`,
        method: "POST",
        data: body,
      }),
    }),

    // Enrollments
    createEnrollment: builder.mutation<{ success: boolean }, { courseId: string }>({
      query: ({ courseId }) => ({
        url: `/enrollments/${courseId}`,
        method: "POST",
      }),
    }),

    // Notifications
    getNotifications: builder.query<unknown, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
    }),

    // Analytics (admin)
    getAnalyticsSummary: builder.query<unknown, void>({
      query: () => ({
        url: "/analytics/summary",
        method: "GET",
      }),
    }),
    getEnrollmentGrowth: builder.query<unknown, void>({
      query: () => ({
        url: "/analytics/enrollment-growth",
        method: "GET",
      }),
    }),
    getTopCourses: builder.query<unknown, void>({
      query: () => ({
        url: "/analytics/top-courses",
        method: "GET",
      }),
    }),
    getRevenue: builder.query<unknown, void>({
      query: () => ({
        url: "/analytics/revenue",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useCreateLessonMutation,
  useCompleteLessonMutation,
  useCreateEnrollmentMutation,
  useGetNotificationsQuery,
  useGetAnalyticsSummaryQuery,
  useGetEnrollmentGrowthQuery,
  useGetTopCoursesQuery,
  useGetRevenueQuery,
} = authApi;
