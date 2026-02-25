// Export all API slices
import { authApi } from "@/features/auth/authApi";
import { usersApi } from "@/features/users/usersApi";
import { categoriesApi } from "@/features/categories/categoriesApi";
import { coursesApi } from "@/features/courses/coursesApi";
import { lessonsApi } from "@/features/lessons/lessonsApi";
import { enrollmentsApi } from "@/features/enrollments/enrollmentsApi";
import { notificationsApi } from "@/features/notifications/notificationsApi";
import { analyticsApi } from "@/features/analytics/analyticsApi";

// Re-export APIs
export {
  authApi,
  usersApi,
  categoriesApi,
  coursesApi,
  lessonsApi,
  enrollmentsApi,
  notificationsApi,
  analyticsApi,
};

// Export hooks for each API
export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
} = authApi;

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

export const {
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;

export const {
  useCreateCourseMutation,
  useGetCoursesQuery,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useGetCoursesCursorQuery,
} = coursesApi;

export const { useCreateLessonMutation, useCompleteLessonMutation } =
  lessonsApi;

export const { useCreateEnrollmentMutation } = enrollmentsApi;

export const { useGetNotificationsQuery } = notificationsApi;

export const {
  useGetAnalyticsSummaryQuery,
  useGetEnrollmentGrowthQuery,
  useGetTopCoursesQuery,
  useGetRevenueQuery,
} = analyticsApi;
