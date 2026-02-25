import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type {
  IAnalyticsSummary,
  IEnrollmentGrowth,
  ITopCourse,
  IRevenue,
} from "@/types/analytics.type";

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query<IAnalyticsSummary, void>({
      query: () => ({
        url: "/analytics/summary",
        method: "GET",
      }),
      providesTags: [apiTags.ANALYTICS],
    }),
    getEnrollmentGrowth: builder.query<IEnrollmentGrowth[], void>({
      query: () => ({
        url: "/analytics/enrollment-growth",
        method: "GET",
      }),
      providesTags: [apiTags.ANALYTICS],
    }),
    getTopCourses: builder.query<ITopCourse[], void>({
      query: () => ({
        url: "/analytics/top-courses",
        method: "GET",
      }),
      providesTags: [apiTags.ANALYTICS],
    }),
    getRevenue: builder.query<IRevenue[], void>({
      query: () => ({
        url: "/analytics/revenue",
        method: "GET",
      }),
      providesTags: [apiTags.ANALYTICS],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAnalyticsSummaryQuery,
  useGetEnrollmentGrowthQuery,
  useGetTopCoursesQuery,
  useGetRevenueQuery,
} = analyticsApi;
