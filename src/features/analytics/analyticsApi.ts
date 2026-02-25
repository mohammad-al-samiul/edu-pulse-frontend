 import { baseApi } from "@/redux/api/baseApi";
 
 export const analyticsApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
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
  overrideExisting: false,
});
 
 export const {
   useGetAnalyticsSummaryQuery,
   useGetEnrollmentGrowthQuery,
   useGetTopCoursesQuery,
   useGetRevenueQuery,
 } = analyticsApi;
