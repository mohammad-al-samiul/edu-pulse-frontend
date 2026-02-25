import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type { ApiResponse, CursorResponse } from "@/types/api.type";
import type {
  ICourse,
  ICourseCreate,
  ICourseUpdate,
  ICourseFilters,
} from "@/types/course.type";

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation<ICourse, ICourseCreate>({
      query: (body) => ({
        url: "/courses",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.COURSE_LIST],
    }),
    getCourses: builder.query<
      {
        courses: ICourse[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      ICourseFilters
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
      transformResponse: (response: {
        data: {
          mode: string;
          data: ICourse[];
          meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }) => ({
        courses: response.data.data,
        total: response.data.meta.total,
        page: response.data.meta.page,
        limit: response.data.meta.limit,
        totalPages: response.data.meta.totalPages,
      }),
      providesTags: [apiTags.COURSE_LIST],
    }),
    updateCourse: builder.mutation<
      ICourse,
      { id: string; body: ICourseUpdate }
    >({
      query: ({ id, body }) => ({
        url: `/courses/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [apiTags.COURSE, apiTags.COURSE_LIST],
    }),
    getCourseById: builder.query<ICourse, { id: string }>({
      query: ({ id }) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: [apiTags.COURSE],
    }),
    getCoursesCursor: builder.query<
      CursorResponse<ICourse>,
      {
        cursor?: string | null;
        limit?: number;
        categoryId?: string;
        status?: string;
      }
    >({
      query: ({ cursor, limit = 12, categoryId, status } = {}) => ({
        url: "/courses",
        method: "GET",
        params: { cursor, limit, categoryId, status },
      }),
      transformResponse: (resp: ApiResponse<CursorResponse<ICourse>>) =>
        resp.data,
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
