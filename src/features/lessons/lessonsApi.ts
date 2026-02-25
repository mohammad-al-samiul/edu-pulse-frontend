import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type {
  ILesson,
  ILessonCreate,
  ILessonComplete,
} from "@/types/lesson.type";

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation<ILesson, ILessonCreate>({
      query: (body) => ({
        url: "/lessons",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.LESSON_LIST],
    }),
    completeLesson: builder.mutation<
      { success: boolean },
      { lessonId: string; body: ILessonComplete }
    >({
      query: ({ lessonId, body }) => ({
        url: `/lessons/complete/${lessonId}`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: [apiTags.LESSON, apiTags.ENROLLMENT],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateLessonMutation, useCompleteLessonMutation } =
  lessonsApi;
