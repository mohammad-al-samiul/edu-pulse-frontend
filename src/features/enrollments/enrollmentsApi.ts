 import { baseApi } from "@/redux/api/baseApi";
 
 export const enrollmentsApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
     createEnrollment: builder.mutation<{ success: boolean }, { courseId: string }>({
       query: ({ courseId }) => ({
         url: `/enrollments/${courseId}`,
         method: "POST",
       }),
     }),
   }),
  overrideExisting: false,
});
 
 export const { useCreateEnrollmentMutation } = enrollmentsApi;
