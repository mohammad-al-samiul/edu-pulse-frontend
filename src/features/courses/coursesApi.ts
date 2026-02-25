 import { baseApi } from "@/redux/api/baseApi";
 import type { ApiResponse, CursorResponse, ICourse } from "@/types/api.type";
 
 export const coursesApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
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
     getCoursesCursor: builder.query<
       CursorResponse<ICourse>,
       { cursor?: string | null; limit?: number; categoryId?: string; status?: string }
     >({
       query: ({ cursor, limit = 12, categoryId, status } = {}) => ({
         url: "/courses",
         method: "GET",
         params: { cursor, limit, categoryId, status },
       }),
       transformResponse: (resp: ApiResponse<CursorResponse<ICourse>>) => resp.data,
       serializeQueryArgs: ({ endpointName, queryArgs }) => {
         const { limit, categoryId, status } = queryArgs || {};
         return `${endpointName}|${JSON.stringify({ limit, categoryId, status })}`;
       },
       merge: (currentCache, newData) => {
         const seen = new Set(currentCache.data.map((c) => c.id));
         for (const item of newData.data) {
           if (!seen.has(item.id)) {
             currentCache.data.push(item);
             seen.add(item.id);
           }
         }
         currentCache.nextCursor = newData.nextCursor;
       },
       forceRefetch({ currentArg, previousArg }) {
         return currentArg?.cursor !== previousArg?.cursor;
       },
     }),
   }),
  overrideExisting: false,
});
 
 export const {
   useCreateCourseMutation,
   useGetCoursesQuery,
   useUpdateCourseMutation,
   useGetCourseByIdQuery,
   useGetCoursesCursorQuery,
 } = coursesApi;
