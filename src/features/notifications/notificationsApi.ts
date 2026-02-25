import { baseApi } from "@/redux/api/baseApi";
import { apiTags } from "@/redux/api/apiTags";
import type { INotification } from "@/types/notification.type";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<INotification[], void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: [apiTags.NOTIFICATION_LIST],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery } = notificationsApi;
