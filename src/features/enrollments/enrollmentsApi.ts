import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type { IEnrollment, IEnrollmentCreate } from "@/types/enrollment.type";

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEnrollment: builder.mutation<IEnrollment, IEnrollmentCreate>({
      query: ({ courseId }) => ({
        url: `/enrollments/${courseId}`,
        method: "POST",
      }),
      invalidatesTags: [apiTags.ENROLLMENT_LIST],
    }),
    deleteEnrollment: builder.mutation<
      { success: boolean },
      { courseId: string }
    >({
      query: ({ courseId }) => ({
        url: `/enrollments/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: [apiTags.ENROLLMENT_LIST],
    }),
    getMyEnrollments: builder.query<IEnrollment[], void>({
      query: () => ({
        url: "/enrollments/my",
        method: "GET",
      }),
      transformResponse: (response: {
        data: {
          mode: string;
          data: IEnrollment[];
          meta?: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
        };
      }) => response.data.data,
      providesTags: [apiTags.ENROLLMENT_LIST],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetMyEnrollmentsQuery,
} = enrollmentsApi;
