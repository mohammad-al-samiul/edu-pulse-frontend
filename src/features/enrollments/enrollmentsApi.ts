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
  }),
  overrideExisting: false,
});

export const { useCreateEnrollmentMutation } = enrollmentsApi;
